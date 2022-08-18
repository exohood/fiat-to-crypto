import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  StateType,
  initialState,
  ItemCategory,
  StaticRoutingItemType,
} from "./initialState";
import { mainReducer, CollectedActionsType, DataActionsType } from "./reducers";

import { arrayUnique, arrayObjUnique } from "../utils";

import LogoOnramper from "../icons/onramper_logo.svg";

import * as API from "./api";
import type {
  ItemType,
  GatewayRateOption,
  ErrorObjectType,
  TypesOfRateError,
  CryptoAddrType,
  CollectedStateType,
  GatewayRateOptionSimple,
} from "./initialState";
import { GatewaysResponse, SelectGatewayByType } from "./api/types/gateways";
import { RateResponse } from "./api/types/rate";
import type {
  NextStep,
  StepDataItems,
  FileStep,
  PickOneOption,
  InfoDepositBankAccount,
} from "./api/types/nextStep";

import { NextStepError } from "./api";
import type { Filters, Transaction } from "./api";
import phoneCodes from "./utils/phoneCodes";
import i18n from "../i18n/config";
import { isLanguageSupported, supportedLanguages } from "./utils/languages";
import { useGTMDispatch } from "../hooks/gtm";
import { GtmEvent, GtmEventCategory, GtmEventLabel } from "../enums";
import { useThirdPartyCookieCheck } from "../hooks/cookie-check/useThirdPartyCookieCheck";

const BASE_DEFAULT_AMOUNT_IN_USD = 100;
const DEFAULT_CURRENCY = "USD";
const DEFAULT_CRYPTO = "BTC";
export const DEFAULT_COUNTRY = "US";
export const DEFAULT_US_STATE = "AL";
export const DEFAULT_CA_STATE = "AB";
const NO_CHAT_COUNTRIES = ["ng"];
const DEFAULT_DISPLAYCHATBUBBLE = true;
const DEFAULT_PAYMENT_METHOD = ["creditCard"];

//Creating context
const APIContext = createContext<StateType>(initialState);

interface APIProviderType {
  API_KEY?: string;
  defaultAmount?: number;
  defaultAddrs?: { [denom: string]: CryptoAddrType };
  defaultCrypto?: string;
  defaultFiat?: string;
  defaultFiatSoft?: string;
  defaultPaymentMethod?: string[];
  filters?: Filters;
  country?: string;
  language?: string;
  isAddressEditable?: boolean;
  themeColor: string;
  displayChatBubble?: boolean;
  amountInCrypto?: boolean;
  partnerContext?: { [key: string]: any };
  redirectURL?: string;
  minAmountEur?: number;
  supportSell: boolean;
  supportBuy: boolean;
  isAmountEditable?: boolean;
  recommendedCryptoCurrencies?: string[];
  darkMode?: boolean;
  selectGatewayBy?: string | "price" | "performance";
  skipTransactionScreen?: boolean;
  transaction: Transaction;
}

/**
 * Provided a language will update the i18n and headers if required.
 *
 * @param language The ISO 639-1 language code. E.g. 'ja'. See: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
function updateLanguageIfRequired(language: string) {
  if (i18n.language !== language) i18n.changeLanguage(language);
  if (API.getAcceptLanguageParameter() !== language)
    API.updateAcceptLanguageParameter();
}

const APIProvider: React.FC<APIProviderType> = (props) => {
  const {
    defaultAmount = 100,
    defaultAddrs = {},
    API_KEY,
    isAddressEditable = true,
    defaultPaymentMethod = DEFAULT_PAYMENT_METHOD,
  } = props;
  const defaultFiat = props.defaultFiat?.toUpperCase();
  const defaultFiatSoft =
    props.defaultFiatSoft?.toUpperCase() || DEFAULT_CURRENCY;
  const defaultCrypto = props.defaultCrypto?.toUpperCase() || DEFAULT_CRYPTO;

  const sendDataToGTM = useGTMDispatch();
  const is3pcCookiesSupported = useThirdPartyCookieCheck();
  const generateInitialCollectedState = useCallback((): CollectedStateType => {
    return {
      ...initialState.collected,
      amount: defaultAmount < 0 ? initialState.collected.amount : defaultAmount,
      defaultAddrs: Object.entries(defaultAddrs).reduce(
        (acc, [key, value]) => ({ ...acc, [key.toUpperCase()]: value }),
        {}
      ),
      isAddressEditable,
      themeColor: props.themeColor,
      amountInCrypto:
        props.amountInCrypto ?? initialState.collected.amountInCrypto,
      partnerContext: props.partnerContext,
      redirectURL: props.redirectURL,
      minAmountEur: props.minAmountEur,
      supportSell: props.supportSell,
      supportBuy: props.supportBuy,
      isAmountEditable:
        props.isAmountEditable ?? initialState.collected.isAmountEditable,
      recommendedCryptoCurrencies: props.recommendedCryptoCurrencies
        ? arrayUnique(props.recommendedCryptoCurrencies)
        : undefined,
      selectGatewayBy: props.selectGatewayBy,
      skipTransactionScreen: props.skipTransactionScreen,
      transaction: props.transaction,
    };
  }, [
    defaultAmount,
    defaultAddrs,
    isAddressEditable,
    props.themeColor,
    props.amountInCrypto,
    props.partnerContext,
    props.redirectURL,
    props.minAmountEur,
    props.supportSell,
    props.supportBuy,
    props.isAmountEditable,
    props.recommendedCryptoCurrencies,
    props.selectGatewayBy,
    props.skipTransactionScreen,
    props.transaction,
  ]);

  const iniState: StateType = {
    ...initialState,
    collected: generateInitialCollectedState(),
  };
  const [state, dispatch] = useReducer(mainReducer, iniState);
  const [lastCall, setLastCall] = useState<AbortController>();

  // INITIALIZING AUTHENTICATION
  useEffect(() => {
    if (!API_KEY) throw new Error("API KEY NOT PROVIDED");
    API.authenticate(API_KEY);
  }, [API_KEY]);

  /* DEFINING INPUT INTERFACES */
  const handleInputChange = useCallback(
    (
      name: string,
      value:
        | string
        | number
        | boolean
        | ItemType
        | ErrorObjectType[]
        | { [key: string]: string }
        | undefined
    ) =>
      dispatch({
        type: CollectedActionsType.AddField,
        payload: { name, value },
      }),
    []
  );

  const updateStaticRouting = useCallback(
    (value: StaticRoutingItemType[]) =>
      dispatch({
        type: CollectedActionsType.UpdateStaticRoute,
        payload: { value },
      }),
    []
  );

  useEffect(() => {
    handleInputChange("isAddressEditable", isAddressEditable);
  }, [isAddressEditable, handleInputChange]);

  useEffect(() => {
    if (lastCall) handleInputChange("isCalculatingAmount", true);
    else
      handleInputChange(
        "isCalculatingAmount",
        state.data.responseRate === undefined
      );
  }, [lastCall, handleInputChange, state.data.responseRate]);

  const addData = useCallback(
    (data: any) =>
      dispatch({ type: DataActionsType.AddData, payload: { value: data } }),
    []
  );

  const processErrors = useCallback((newError: ErrorObjectType) => {
    dispatch({
      type: CollectedActionsType.AddError,
      payload: { value: newError },
    });
    return newError;
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({
      type: CollectedActionsType.AddError,
      payload: { value: undefined },
    });
  }, []);

  const getGatewayStaticRouting = useCallback(
    async (country: string) => {
      try {
        const data = await API.getGatewayStaticRouting(country);
        updateStaticRouting(data.recommended);
        return data;
      } catch (error) {
        return processErrors({
          GATEWAYS: {
            type: "API",
            message: error.message,
          },
        });
      }
    },
    [processErrors, updateStaticRouting]
  );

  const sendExperimentGtmEvent = useCallback(
    (category: string) => {
      sendDataToGTM({
        event: GtmEvent.EXPERIMENT,
        category:
          category === SelectGatewayByType.Price
            ? GtmEventCategory.CONTROL
            : GtmEventCategory.VARIANT_A,
        label: GtmEventLabel.STATIC_ROUTING_EXPERIMENT,
      });
    },
    [sendDataToGTM]
  );

  const initiateRouting = useCallback(
    async (country: string) => {
      const routingData = await getGatewayStaticRouting(country);
      if (!props.selectGatewayBy) {
        // Experimentation - Simplified Approach for static routing
        if (
          Object.keys(typeof routingData === "object" && routingData).length &&
          Date.now() % 10 >= 5
        ) {
          handleInputChange("selectGatewayBy", SelectGatewayByType.Performance);
          sendExperimentGtmEvent(SelectGatewayByType.Performance);
        } else {
          handleInputChange("selectGatewayBy", SelectGatewayByType.Price);
          sendExperimentGtmEvent(SelectGatewayByType.Price);
        }
      }
    },
    [
      getGatewayStaticRouting,
      handleInputChange,
      props.selectGatewayBy,
      sendExperimentGtmEvent,
    ]
  );
  const restartWidget = useCallback(() => {
    dispatch({
      type: CollectedActionsType.ResetCollected,
      payload: { value: generateInitialCollectedState() },
    });
  }, [generateInitialCollectedState]);

  /* *********** */
  const init = useCallback(
    async (country?: string): Promise<ErrorObjectType | undefined | {}> => {
      const actualCountry = props.country || country;
      handleInputChange("is3pcCookiesSupported", is3pcCookiesSupported);
      // The language provided explicitly via the '?language=' query parameter.
      let explicitLanguage;
      if (props.language) {
        if (isLanguageSupported(props.language))
          explicitLanguage = props.language;
        else
          console.error(
            `The language set by the query parameter '?language=${props.language}' is not supported. ` +
              `The following languages are currently supported by Onramper: [${supportedLanguages}]. ` +
              `For more information, see: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes.`
          );
      }

      if (explicitLanguage) updateLanguageIfRequired(explicitLanguage);

      // REQUEST AVAILABLE GATEWAYS
      let rawResponseGateways: GatewaysResponse;
      let responseGateways: GatewaysResponse;
      try {
        clearErrors();
        rawResponseGateways = await API.gateways({
          country: actualCountry,
          includeIcons: true,
          includeDefaultAmounts: true,
        });
        responseGateways = API.filterGatewaysResponse(
          rawResponseGateways,
          props.filters
        );
      } catch (error) {
        return processErrors({
          GATEWAYS: {
            type: "API",
            message: error.message,
          },
        });
      }
      const widgetsCountry =
        actualCountry ||
        responseGateways.localization.country ||
        DEFAULT_COUNTRY;
      handleInputChange("selectedCountry", widgetsCountry);
      if (
        !NO_CHAT_COUNTRIES.includes(widgetsCountry) &&
        (props.displayChatBubble || props.displayChatBubble === undefined)
      )
        handleInputChange("displayChatBubble", DEFAULT_DISPLAYCHATBUBBLE);
      if (responseGateways.gateways.length <= 0) {
        if (rawResponseGateways.gateways.length > 0) {
          return processErrors({
            GATEWAYS: {
              type: "DISABLED_GATEWAYS",
              message: "Gateways disabled by filters.",
            },
          });
        }
        return processErrors({
          GATEWAYS: {
            type: "NO_GATEWAYS",
            message: "No gateways found.",
          },
        });
      }

      initiateRouting(widgetsCountry);

      const ICONS_MAP = responseGateways.icons || {};

      // GET ALL AVAILABLE CRYPTOS
      let availableCryptos: GatewaysResponse["gateways"][0]["cryptoCurrencies"] =
        [];
      for (const i in responseGateways.gateways) {
        if (!responseGateways.gateways[i].cryptoCurrencies) continue;
        availableCryptos = availableCryptos.concat(
          responseGateways.gateways[i].cryptoCurrencies
        );
      }
      availableCryptos = arrayObjUnique(availableCryptos, "id");
      if (availableCryptos.length <= 0) {
        return processErrors({
          GATEWAYS: {
            type: "NO_ITEMS",
            message: "No cryptos found.",
          },
        });
      }

      availableCryptos = API.sortCryptoByRecommended(
        availableCryptos,
        props.recommendedCryptoCurrencies
      );

      // MAP AVAILABLE CRYPTOS LIST (CURRENCY LIST) TO AN ITEMTYPE LIST
      const mappedAvailableCryptos: ItemType[] = availableCryptos.map(
        (crypto) => {
          return {
            id: crypto.id,
            name: crypto.code,
            info:
              crypto.displayName ||
              ICONS_MAP[crypto.code]?.name ||
              "Cryptocurrency",
            icon: ICONS_MAP[crypto.code]?.icon,
            precision: crypto.precision,
            symbol: crypto.code,
            supportsAddressTag: crypto.supportsAddressTag,
            currencyType: ItemCategory.Crypto,
            network: crypto.network,
          };
        }
      );

      // save to state.collected
      const defaultState =
        widgetsCountry.toUpperCase() === "US"
          ? DEFAULT_US_STATE
          : DEFAULT_CA_STATE;
      handleInputChange(
        "state",
        responseGateways.localization.state ?? defaultState
      );
      handleInputChange(
        "phoneCountryCode",
        +phoneCodes[
          responseGateways.localization.country?.toUpperCase() ??
            DEFAULT_COUNTRY
        ]?.phoneCode
      );
      // save to state.date
      addData({
        availableCryptos: mappedAvailableCryptos,
        ICONS_MAP,
        responseGateways: responseGateways,
      });
    },
    [
      props.country,
      props.language,
      props.displayChatBubble,
      props.recommendedCryptoCurrencies,
      props.filters,
      handleInputChange,
      is3pcCookiesSupported,
      initiateRouting,
      addData,
      clearErrors,
      processErrors,
    ]
  );

  const handleCryptoChange = useCallback(
    (crypto?: ItemType): ErrorObjectType | undefined | {} => {
      let _crypto: typeof crypto;
      if (!crypto)
        _crypto = state.collected.selectedCrypto || {
          id: defaultCrypto,
          name: defaultCrypto,
        };
      else _crypto = crypto;

      // IF RESPONSE IS NOT SET YET, DON'T DO ANYTHING
      if (!state.data.responseGateways) return {};
      const gateways = state.data.responseGateways.gateways;

      if (gateways.length <= 0) return {};
      if (state.data.availableCryptos.length <= 0) return {};

      const actualCrypto =
        state.data.availableCryptos.find(
          (cryptoCurrency) => cryptoCurrency.id === _crypto?.id
        ) || state.data.availableCryptos[0];

      // FILTER POSIBLE GATEWAYS BY SELECTED CRYPTO
      const filtredGatewaysByCrypto = gateways.filter((item) =>
        item.cryptoCurrencies.some((crypto) => crypto.id === actualCrypto.id)
      );

      // GET ALL AVAILABLE FIAT CURRENCIES THAT CAN BE USED TO BUY THE SELECTED CRYPTO
      let availableCurrencies: GatewaysResponse["gateways"][0]["fiatCurrencies"] =
        [];
      for (const i in filtredGatewaysByCrypto) {
        if (!filtredGatewaysByCrypto[i].fiatCurrencies) continue;
        availableCurrencies = availableCurrencies.concat(
          filtredGatewaysByCrypto[i].fiatCurrencies
        );
      }

      availableCurrencies = arrayObjUnique(availableCurrencies, "id");
      if (availableCurrencies.length <= 0) {
        return processErrors({
          GATEWAYS: {
            type: "NO_ITEMS",
            message: "No fiat currencies found.",
          },
        });
      }

      // MAP AVAILABLE FIAT CURRENCIES (CURRENCY LIST) TO AN ITEMTYPE LIST
      const ICONS_MAP = state.data.responseGateways.icons || {};
      const mappedAvailableCurrencies: ItemType[] = availableCurrencies.map(
        (currency) => ({
          id: currency.id,
          name: currency.code,
          info: ICONS_MAP[currency.code]?.name || "Currency",
          icon: ICONS_MAP[currency.code]?.icon,
          precision: currency.precision,
          symbol: ICONS_MAP[currency.code]?.symbol,
          currencyType: ItemCategory.Currency,
        })
      );

      // save to state.collected
      handleInputChange("selectedCrypto", actualCrypto);
      const addrs = state.collected.defaultAddrs[actualCrypto.id];
      const addrs2 = Object.entries(state.collected.defaultAddrs).find(([k]) =>
        k.includes(state.collected.selectedCrypto?.name ?? "-1")
      );
      handleInputChange("cryptocurrencyAddress", {
        address: addrs?.address ?? addrs2?.[1]?.address,
        memo: addrs?.memo ?? addrs2?.[1]?.memo,
      } as any);
      // save to state.date
      addData({
        availableCurrencies: mappedAvailableCurrencies,
        filtredGatewaysByCrypto,
      });
    },
    [
      state.data.responseGateways,
      state.data.availableCryptos,
      addData,
      handleInputChange,
      state.collected.selectedCrypto,
      processErrors,
      defaultCrypto,
      state.collected.defaultAddrs,
    ]
  );

  const withSortedByDefaultPaymentMethods = useCallback(
    (availablePaymentMethods: string[]) => {
      const prioritized = defaultPaymentMethod.filter((item) =>
        availablePaymentMethods.some((availableItem) => availableItem === item)
      );
      const unPrioritized = availablePaymentMethods.filter(
        (item) => !prioritized.some((defaultItem) => defaultItem === item)
      );
      return [...prioritized, ...unPrioritized];
    },
    [defaultPaymentMethod]
  );

  const handleCurrencyChange = useCallback(
    (selectedCurrency?: ItemType): ErrorObjectType | undefined | {} => {
      let _selectedCurrency: typeof selectedCurrency;

      if (!selectedCurrency)
        _selectedCurrency =
          state.collected.selectedCurrency ||
          (defaultFiat ? { id: defaultFiat, name: defaultFiat } : undefined);
      else _selectedCurrency = selectedCurrency;

      // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
      const responseGateways = state.data.responseGateways;
      if (!responseGateways) return {};

      // IF LIST IS EMPTY, DON'T DO ANYTHING
      const filtredGatewaysByCrypto = state.data.filtredGatewaysByCrypto;
      if (!filtredGatewaysByCrypto || filtredGatewaysByCrypto.length <= 0)
        return {};
      if (
        !state.data.availableCurrencies ||
        state.data.availableCurrencies.length <= 0
      )
        return {};

      const actualCurrency =
        state.data.availableCurrencies.find(
          (currency) => currency.id === _selectedCurrency?.id
        ) ||
        state.data.availableCurrencies.find(
          (currency) => currency.id === responseGateways.localization.currency
        ) ||
        state.data.availableCurrencies.find(
          (currency) => currency.id === defaultFiatSoft
        ) ||
        state.data.availableCurrencies[0];

      if (!state.collected.selectedCurrency) {
        let calculatedDefaultAmount = defaultAmount;
        if (!props.amountInCrypto) {
          const DEFAULT_AMOUNTS_MAP = responseGateways.defaultAmounts ?? {};
          const defaultLocalCurrencyAmount =
            DEFAULT_AMOUNTS_MAP[actualCurrency.id] ?? 200;
          calculatedDefaultAmount =
            (defaultLocalCurrencyAmount * defaultAmount) /
            BASE_DEFAULT_AMOUNT_IN_USD;
        }
        handleInputChange("amount", calculatedDefaultAmount);
      }

      // FILTER POSIBLE GATEWAYS BY SELECTED CURRENCY
      const filtredGatewaysByCurrency = filtredGatewaysByCrypto.filter((item) =>
        item.fiatCurrencies.some(
          (currency) => currency.id === actualCurrency.id
        )
      );

      // GET ALL AVAILABLE PAYMENT METHODS THAT CAN BE USED TO BUY THE SELECTED CRYPTO WITH THE SELECTED CURRENCY
      let availablePaymentMethods: GatewaysResponse["gateways"][0]["paymentMethods"] =
        [];
      for (const i in filtredGatewaysByCurrency) {
        if (!filtredGatewaysByCurrency[i].paymentMethods) continue;
        availablePaymentMethods = availablePaymentMethods.concat(
          filtredGatewaysByCurrency[i].paymentMethods
        );
      }
      availablePaymentMethods = withSortedByDefaultPaymentMethods(
        arrayUnique(availablePaymentMethods)
      );
      if (availablePaymentMethods.length <= 0) {
        return processErrors({
          GATEWAYS: {
            type: "NO_ITEMS",
            message: "No payment methods availables found.",
          },
        });
      }

      // MAP AVAILABLE FIAT CURRENCIES (CURRENCY LIST) TO AN ITEMTYPE LIST
      const ICONS_MAP = responseGateways.icons || {};
      const mappedAvailablePaymentMethods: ItemType[] =
        availablePaymentMethods.map((item) => ({
          id: item,
          name: ICONS_MAP[item]?.name || item,
          symbol: "",
          info: "",
          icon: ICONS_MAP[item]?.icon,
          type: ItemCategory.PaymentMethod,
        }));

      // save to state.collected
      handleInputChange("selectedCurrency", actualCurrency);
      // save to state.date
      addData({
        availablePaymentMethods: mappedAvailablePaymentMethods,
        filtredGatewaysByCurrency,
      });
    },
    [
      processErrors,
      handleInputChange,
      addData,
      state.data.filtredGatewaysByCrypto,
      state.data.availableCurrencies,
      state.data.responseGateways,
      state.collected.selectedCurrency,
      defaultAmount,
      defaultFiat,
      defaultFiatSoft,
      props.amountInCrypto,
      withSortedByDefaultPaymentMethods,
    ]
  );

  const handlePaymentMethodChange = useCallback(
    (selectedPaymentMethod?: ItemType): ErrorObjectType | undefined | {} => {
      if (
        !state.data.responseGateways ||
        !state.data.availablePaymentMethods ||
        state.data.availablePaymentMethods.length <= 0
      ) {
        return {};
      }

      const paymentToSearch =
        selectedPaymentMethod || state.collected.selectedPaymentMethod;
      const actualPaymentMethod =
        state.data.availablePaymentMethods.find(
          (currency) => currency.id === paymentToSearch?.id
        ) || state.data.availablePaymentMethods[0];
      handleInputChange("selectedPaymentMethod", actualPaymentMethod);
    },
    [
      handleInputChange,
      state.collected.selectedPaymentMethod,
      state.data.availablePaymentMethods,
      state.data.responseGateways,
    ]
  );

  const getRates = useCallback(async (): Promise<
    ErrorObjectType | undefined | {}
  > => {
    // IF RESPONSE IS NOT SET, DON'T DO ANYTHING
    if (!state.data.responseGateways) return;

    // IF THE AMOUNT IS NOT SET OR IT'S ===0 THEN NO AVAILABLE RATES
    if (!state.collected.amount || !isFinite(state.collected.amount)) {
      clearErrors();
      addData({ allRates: [] });
      return;
    }

    // CHECK IF REQUEST PARAMETERS ARE SET
    const actualAmount = state.collected.amount;
    const inCurrency = state.collected.selectedCurrency?.id;
    const outCurrency = state.collected.selectedCrypto?.id;
    const actualPaymentMethod = state.collected.selectedPaymentMethod?.id;
    if (!inCurrency || !outCurrency || !actualPaymentMethod) return;

    // CREATE NEW ABORT CONTROLLER FOR EACH REQUEST AND STORE IT IN THE LOCAL STATE
    // IF THERE'S ANY PENDING REQUEST THEN ABORT IT BEFORE STORE THE NEW ABORT CONTROLLER
    const controller = new AbortController();
    const { signal } = controller;

    setLastCall((lastController) => {
      lastController?.abort();
      return controller;
    });

    // QUERY AVAILABLE RATES
    // IF THE CATCHED EXCEPTION WAS THROWN BY OUR ABORT CONTROLLER THEN RETURN EMPTY ERROR
    // ELSE, CLEAR THE ABORT CONTROLLER AND RETURN ERROR
    let responseRate: RateResponse;
    let rawResponseRate: RateResponse;
    try {
      clearErrors();
      const address = state.collected.defaultAddrs[outCurrency]?.address;
      const addressTag = state.collected.defaultAddrs[outCurrency]?.memo;
      rawResponseRate = await API.rate(
        inCurrency,
        outCurrency,
        actualAmount,
        actualPaymentMethod,
        {
          country: state.collected.selectedCountry,
          amountInCrypto: state.collected.amountInCrypto,
          includeIcons: true,
          address,
          addressTag,
          minAmountEur: props.minAmountEur,
        },
        signal
      );

      responseRate = API.filterRatesResponse(
        rawResponseRate,
        props.filters?.onlyGateways,
        state.collected.defaultAddrs,
        state.collected.selectedCrypto?.id
      );
    } catch (error) {
      if (error.name === "AbortError") return {};
      setLastCall(undefined);
      addData({ isRateError: true });
      return processErrors({
        RATE: {
          type: "API",
          message: error.message,
        },
      });
    }

    // IF THE REQUEST DIDN'T THROW ANY ERROR, CLEAR THE ABORT CONTROLLER FROM THE STATE
    setLastCall(undefined);

    if (responseRate) {
      addData({ responseRate: responseRate });
    }

    if (!responseRate || responseRate.length <= 0) {
      addData({ isRateError: true });
      return processErrors({
        RATE: {
          type: "NO_RATES",
          message: `We tried but... we haven't found any gateway for this combination of cryptocurrency, fiat currency, payment method and/or prefilled ${outCurrency} wallet address. Please, try with another one or contact us.`,
        },
      });
    }

    // MAP RATES TO GatewayOptionType
    const mappedAllRates: GatewayRateOption[] = responseRate.map((item) => ({
      id: item.identifier,
      name: item.identifier,
      identifier: item.identifier,
      duration: item.duration,
      available: item.available,
      rate: item.rate,
      fees: item.fees,
      requiredKYC: item.requiredKYC,
      receivedCrypto: item.receivedCrypto,
      nextStep: item.nextStep,
      error: item.error,
      icon: item.icon || LogoOnramper,
    }));

    // save to state.date
    addData({ allRates: mappedAllRates });

    // IF THERE ARE NO RATES AVAILABLES THEN REDUCE UNAVAILABLE RATES TO AN ERRORS OBJECT
    const unavailableRates = responseRate.filter((item) => !item.available);
    if (responseRate.length - unavailableRates.length <= 0) {
      const minMaxErrors = unavailableRates.reduce(
        (minMaxErrors: { [key: string]: any }, item) => {
          if (!item.error) return minMaxErrors;
          switch (item.error.type) {
            case "MIN":
              if (
                !minMaxErrors["MIN"] ||
                (item.error.limit ?? Number.POSITIVE_INFINITY) <
                  minMaxErrors[item.error.type].limit
              ) {
                minMaxErrors[item.error.type] = {
                  message: item.error.message,
                  limit: item.error.limit,
                };
              }
              return minMaxErrors;
            case "MAX":
              if (
                !minMaxErrors[item.error.type] ||
                (item.error.limit ?? Number.NEGATIVE_INFINITY) >
                  minMaxErrors[item.error.type].limit
              ) {
                minMaxErrors[item.error.type] = {
                  message: item.error.message,
                  limit: item.error.limit,
                };
              }
              return minMaxErrors;
            default:
              //minMaxErrors[item.error.type] = item.error.message
              //minMaxErrors["OTHER"] = item.error.message
              return minMaxErrors;
          }
        },
        {}
      );

      let errNAME: TypesOfRateError = "MIN";
      //only send 1 error with the following priority
      if (minMaxErrors.MIN) errNAME = "MIN";
      else if (minMaxErrors.MAX) errNAME = "MAX";
      else {
        addData({ isRateError: true });
        return processErrors({
          RATE: {
            type: "ALL_UNAVAILABLE",
            message:
              "No gateways connected at this moment, please, try again in some minutes.",
          },
        });
      }
      addData({ isRateError: true });
      return processErrors({
        RATE: {
          type: errNAME,
          message: minMaxErrors[errNAME]?.message,
          limit: minMaxErrors[errNAME]?.limit,
        },
      });
    }

    // IF NO ERRORS, RETURN UNDEFINED
    return undefined;
  }, [
    addData,
    state.collected.selectedCountry,
    state.collected.selectedCrypto,
    state.collected.selectedCurrency,
    state.collected.amount,
    state.collected.amountInCrypto,
    state.data.responseGateways,
    state.collected.selectedPaymentMethod,
    state.collected.defaultAddrs,
    processErrors,
    clearErrors,
    props.filters?.onlyGateways,
    props.minAmountEur,
  ]);

  useEffect(() => {
    handleCryptoChange();
  }, [handleCryptoChange]);

  useEffect(() => {
    handleCurrencyChange();
  }, [handleCurrencyChange]);

  useEffect(() => {
    handlePaymentMethodChange();
  }, [handlePaymentMethodChange]);

  useEffect(() => {
    // ["Wyre", "Moonpay", ...] current available rates
    const allRatesNames = state.data.allRates.map((rate) => rate.identifier);
    // [{identifier, cryptoCurrencies, ...}, ...] gateways not availables for current crypto, fiat and payment method
    const hiddenRates = state.data.responseGateways?.gateways.filter(
      (gateway) => !allRatesNames.includes(gateway.identifier)
    );
    // gateways not availables for current crypto, fiat and payment method that includes crypto selection
    const hiddenRatesWithMyCrypto = hiddenRates?.filter((rate) =>
      rate.cryptoCurrencies.some(
        (crypto) => crypto.id === state.collected.selectedCrypto?.id
      )
    );
    // gateways not availables for current crypto, fiat and payment method that includes crypto selection and fiat selection
    const hiddenRatesWithMyCryptoAndCurrency = hiddenRatesWithMyCrypto?.filter(
      (rate) =>
        rate.fiatCurrencies.some(
          (Fiat) => Fiat.code === state.collected.selectedCurrency?.id
        )
    );

    // [{identifier: ["EUR", "USD", ...]}] currencies of gateways not availables for current crypto, fiat and payment method that includes crypto selection
    const hiddenCurrenciesByCrypto = hiddenRatesWithMyCrypto?.reduce(
      (acc, rate) => {
        const newAcc = [];
        for (let index = 0; index < rate.fiatCurrencies.length; index++) {
          const element = rate.fiatCurrencies[index].code;
          if (!acc[rate.identifier]?.includes(element)) newAcc.push(element);
        }
        return {
          ...acc,
          [rate.identifier]: [...(acc[rate.identifier] ?? []), ...newAcc],
        };
      },
      {} as { [identifier: string]: string[] }
    );

    // [{identifier: ["ccard", "bank", ...]}] payment methods of gateways not availables for current crypto, fiat and payment method that includes crypto selection and fiat selection
    const hiddenPaymentMethodsByCryptoFiat =
      hiddenRatesWithMyCryptoAndCurrency?.reduce((acc, rate) => {
        const newAcc = [];
        for (let index = 0; index < rate.paymentMethods.length; index++) {
          const element = rate.paymentMethods[index];
          if (!acc[rate.identifier]?.includes(element)) newAcc.push(element);
        }
        return {
          ...acc,
          [rate.identifier]: [...(acc[rate.identifier] ?? []), ...newAcc],
        };
      }, {} as { [identifier: string]: string[] });

    const selectedCrypto = state.collected.selectedCrypto?.id ?? "";

    const memoUsed =
      state.collected.defaultAddrs[selectedCrypto]?.memo !== undefined;

    const mappedHiddenByCrypto = Object.entries(hiddenCurrenciesByCrypto ?? {})
      // if memo is used, then remove gateways that doesn't accept it
      // 1. select all gateways with the same identifier (filter)
      // 2. check if any of the gateways entries (some) that includes our crypto (find, always true) supports address tag for the crypto
      .filter(
        ([identifier]) =>
          !memoUsed ||
          hiddenRatesWithMyCrypto
            ?.filter((g) => g.identifier === identifier)
            ?.some(
              (g) =>
                g.cryptoCurrencies.find((c) => c.id === selectedCrypto)
                  ?.supportsAddressTag
            )
      )
      .filter(
        (o) =>
          o[1].length > 1 &&
          !o[1].includes(state.collected.selectedCurrency?.id ?? "")
      )
      .map(([identifier, currencies]) => {
        return {
          identifier: identifier,
          icon: state.data.ICONS_MAP?.[identifier]?.icon || LogoOnramper,
          error: {
            type: "OPTION",
            message: (() => {
              const fiats: string[] = [];
              // Adding first popular currencies
              if (currencies.includes("EUR")) fiats.push("EUR");
              if (currencies.includes("USD")) fiats.push("USD");
              if (currencies.includes("GBP")) fiats.push("GBP");
              if (fiats.length < 3)
                for (let i = 0; i < 3 - fiats.length; i++) {
                  const currencyToDisplay = currencies.find(
                    (c) => !fiats.includes(c)
                  );
                  if (currencyToDisplay) fiats.push(currencyToDisplay);
                }
              if (currencies.length > fiats.length)
                fiats.push("other currencies");
              return fiats.reduce((acc, currency, index, arr) => {
                const currencyName = currency;
                if (acc === "") return `Available paying with ${currencyName}`;
                else if (index < arr.length - 1)
                  return `${acc}, ${currencyName}`;
                else if (index === arr.length - 1)
                  return `${acc} or ${currencyName}`;
                else return acc;
              }, "");
            })(),
          },
        };
      });

    const mappedHiddenByFiat = Object.entries(
      hiddenPaymentMethodsByCryptoFiat ?? {}
    )
      // if memo is used, then remove gateways that doesn't accept it
      // 1. select all gateways with the same identifier (filter)
      // 2. check if any of the gateways entries (some) that includes our crypto (find, always true) supports address tag for the crypto
      .filter(
        ([identifier]) =>
          !memoUsed ||
          hiddenRatesWithMyCrypto
            ?.filter((g) => g.identifier === identifier)
            ?.some(
              (g) =>
                g.cryptoCurrencies.find((c) => c.id === selectedCrypto)
                  ?.supportsAddressTag
            )
      )
      .filter(
        (o) =>
          o[1].length >= 1 &&
          !o[1].includes(state.collected.selectedPaymentMethod?.id ?? "")
      )
      .map(([identifier, payments]) => {
        return {
          identifier: identifier,
          icon: state.data.ICONS_MAP?.[identifier]?.icon || LogoOnramper,
          error: {
            type: "OPTION",
            message: payments.reduce((acc, payment, index, arr) => {
              const paymentName = state.data.ICONS_MAP?.[payment].name;
              if (acc === "") return `Available paying with ${paymentName}`;
              else if (index < arr.length - 1) return `${acc}, ${paymentName}`;
              else if (index === arr.length - 1)
                return `${acc} or ${paymentName}`;
              else return acc;
            }, ""),
          },
        };
      });

    const allMappedHidden = arrayObjUnique(
      [...mappedHiddenByFiat, ...mappedHiddenByCrypto],
      "identifier"
    );

    addData({
      mappedHiddenByFiat: allMappedHidden,
      mappedHiddenByCrypto: mappedHiddenByCrypto,
    });
  }, [
    state.collected.selectedPaymentMethod,
    state.collected.selectedCrypto?.id,
    state.collected.selectedCurrency?.id,
    state.data.allRates,
    state.data.responseGateways?.gateways,
    state.data.availableCryptos,
    addData,
    state.data.ICONS_MAP,
    state.collected.defaultAddrs,
  ]);

  useEffect(() => {
    const getRatesEffect = async () => {
      await getRates();
    };
    getRatesEffect();
  }, [getRates]);

  const executeStep = useCallback(
    async (step: NextStep, data: { [key: string]: any }): Promise<NextStep> => {
      if (step.type !== "file" && props.partnerContext !== data.partnerContext)
        throw new Error("Partner context not set properly");
      return await API.executeStep(step, data, {
        country: state.collected.selectedCountry,
      });
    },
    [state.collected.selectedCountry, props.partnerContext]
  );

  return (
    <APIContext.Provider
      value={{
        ...state,
        inputInterface: {
          ...state.inputInterface,
          handleInputChange,
        },
        data: {
          ...state.data,
          handleCryptoChange,
          handleCurrencyChange,
          handlePaymentMethodChange,
          restartWidget,
        },
        apiInterface: { init, executeStep, getRates, clearErrors },
      }}
    >
      {props.children}
    </APIContext.Provider>
  );
};

export { APIProvider, APIContext };

export { ItemCategory, NextStepError };

export type {
  ItemType,
  GatewayRateOption,
  NextStep,
  StepDataItems,
  FileStep,
  InfoDepositBankAccount,
  Filters,
  APIProviderType,
  CollectedStateType,
  GatewayRateOptionSimple,
  PickOneOption,
};
