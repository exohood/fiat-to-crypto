import "abort-controller/polyfill";
import { GatewayRate, RateResponse } from "./types/rate";
import { Currency, GatewaysResponse } from "./types/gateways";
import { FieldError } from "./types/nextStep";
import { NextStep } from "..";
import processMoonpayStep, { moonpayUrlRegex } from "@onramper/moonpay-adapter";
import { BrowserClient, Hub } from "@sentry/browser";
import type { CryptoAddrType } from "../initialState";

import { BASE_API } from "./constants";
import i18next from "i18next";
import i18n from "../../i18n/config";

// Note: custom headers most be allowed by the preflight checks, make sure to add them to `access-control-allow-headers` corsPreflight on the server
const headers = new Headers();
// The language that will be appended to every request as a query parameter. This will indicate the language we want the
// content of the backend to be in.
let currentAcceptLanguage = i18next.language;

const getAcceptLanguageParameter = () => {
  return currentAcceptLanguage;
};

// Language parameter is set here for i18n. The backend will use this to set the language of the responses.
const updateAcceptLanguageParameter = () => {
  const currentI18nLanguage = i18n.language;
  if (currentAcceptLanguage !== currentI18nLanguage)
    currentAcceptLanguage = currentI18nLanguage;
};
updateAcceptLanguageParameter();

// See https://github.com/getsentry/sentry-javascript/issues/1656#issuecomment-430295616
const sentryClient = new BrowserClient({
  dsn: "https://283a138678d94cc295852f634d4cdd1c@o506512.ingest.sentry.io/5638949",
  environment: process.env.STAGE,
});
const sentryHub = new Hub(sentryClient);

const authenticate = (pk: string) => {
  headers.set("Authorization", `Basic ${pk}`);
  const referrer =
    document.referrer ||
    window.parent.location.origin ||
    window.location.origin;
  if (referrer) {
    headers.set("X-Widget-Referer", referrer);
  }
  sentryHub.addBreadcrumb({
    message: `Authenticated with API key '${pk}'`,
    category: "auth",
  });
};

export function logRequest(url: string) {
  sentryHub.addBreadcrumb({ message: `Sent a request to '${url}'` });
}

/**
 * API calls
 */
interface GatewaysParams {
  country?: string;
  includeIcons?: boolean;
  includeDefaultAmounts?: boolean;
  [key: string]: any;
}

const gateways = async (params: GatewaysParams): Promise<GatewaysResponse> => {
  const urlParams = createUrlParamsFromObject(params);
  const gatewaysUrl = `${BASE_API}/gateways?${urlParams}`;
  logRequest(gatewaysUrl);
  const gatewaysRes = await fetch(gatewaysUrl, {
    headers,
    credentials: process.env.STAGE === "local" ? "omit" : "include",
  });
  const gateways: GatewaysResponse = await processResponse(gatewaysRes);
  return gateways;
};

interface RateParams {
  country?: string;
  amountInCrypto?: boolean;
  address?: string;
  addressTag?: string;
  gateway?: string;
  includeIcons?: boolean;
  minAmountEur?: number;
}

const rate = async (
  currency: string,
  crypto: string,
  amount: number,
  paymentMethod: string,
  params?: RateParams,
  signal?: AbortSignal
): Promise<RateResponse> => {
  const urlParams = createUrlParamsFromObject(params ?? {});
  const ratesUrl = `${BASE_API}/rate/${currency}/${crypto}/${paymentMethod}/${amount}?${urlParams}`;
  logRequest(ratesUrl);
  const ratesRes = await fetch(ratesUrl, {
    headers,
    signal,
    credentials: process.env.STAGE === "local" ? "omit" : "include",
  });
  const rates: RateResponse = await processResponse(ratesRes);
  return rates;
};

/**
 * Exectue step
 */
interface ExecuteStepParams {
  country?: string;
  amountInCrypto?: boolean;
  [key: string]: any;
}

interface FetchResponse {
  //should be replaced by a complete fetch type
  ok: boolean;
  json: () => Promise<any>;
  text: () => Promise<string>;
}

const tob64 = async (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};

const executeStep = async (
  step: NextStep,
  data: { [key: string]: any } | File,
  params?: ExecuteStepParams
): Promise<NextStep> => {
  if (!("url" in step)) throw new Error("Invalid step.");
  if (step.url === undefined)
    throw new Error("Unexpected error: Invalid step end.");

  const isMoonpay = isMoonpayStep(step.url);
  const isFile = step.type === "file";
  const isMoonpayFile = isFile && isMoonpay;
  const method = isMoonpayFile ? "PUT" : "POST";
  let body;
  if (isMoonpayFile) body = data as File;
  else if (isFile) body = (await tob64(data as File)) as unknown as string;
  else body = JSON.stringify({ ...data });

  const urlParams = createUrlParamsFromObject(params ?? {});

  logRequest(step.url);
  const nextStepType = step.url.split("/")[5];
  let nextStep: FetchResponse;
  if (isMoonpay && nextStepType !== "redirect") {
    nextStep = await processMoonpayStep(step.url, { method, headers, body });
  } else {
    nextStep = await fetch(`${step.url}?${urlParams}`, {
      method,
      headers,
      body,
    });
  }
  return processResponse(nextStep);
};

const isMoonpayStep = (stepUrl: string) => {
  if (process.env.STAGE === "demo")
    //only for demo purposes
    return false;
  return moonpayUrlRegex.test(stepUrl);
};

/**
 * Utils
 */
export const processResponse = async (
  response: FetchResponse
): Promise<any> => {
  if (response.ok) return await response.json();
  else {
    let errorResponse;
    try {
      errorResponse = await response.json();
    } catch (error) {
      try {
        errorResponse = { message: await response.text() };
      } catch (error) {
        errorResponse = { message: "Error parsing the response" };
      }
    }
    sentryHub.addBreadcrumb({
      message: "Error received from request",
      data: errorResponse,
    });
    sentryHub.captureException(new ApiError(errorResponse.message));
    throw new NextStepError(errorResponse);
  }
};

class ApiError extends Error {
  data?: any;
  constructor(message: string) {
    super(message);
    this.name = message;
  }
}

class NextStepError extends Error {
  fields?: FieldError[] = undefined;
  field?: string = undefined;
  fatal?: boolean = undefined;
  constructor(error: any) {
    super("NextStep error");
    this.name = "NextStepError";
    this.fatal = error.fatal;
    if (Array.isArray(error)) this.fields = error;
    else if (error.field) {
      this.field = error.field;
      this.message = error.message;
    } else this.message = error.message ?? error;
  }
}

const createUrlParamsFromObject = (paramsObj: { [key: string]: any }): string =>
  Object.keys(paramsObj).reduce((acc, current, i, arr) => {
    if (paramsObj[current] !== undefined) {
      acc += `${current}=${paramsObj[current]}`;
      if (i < arr.length - 1) acc += "&";
      return acc;
    }
    return acc;
  }, "");

export interface Filters {
  onlyCryptos?: string[];
  excludeCryptos?: string[];
  onlyPaymentMethods?: string[];
  excludePaymentMethods?: string[];
  excludeFiat?: string[];
  onlyGateways?: string[];
  onlyFiat?: string[];
}
const filterGatewaysResponse = (
  gatewaysResponse: GatewaysResponse,
  filters?: Filters
): GatewaysResponse => {
  if (!filters) return gatewaysResponse;

  const {
    onlyCryptos,
    excludeCryptos,
    onlyPaymentMethods,
    excludePaymentMethods,
    excludeFiat,
    onlyGateways,
    onlyFiat,
  } = filters;

  const _onlyCryptos = onlyCryptos?.map((id) => id.toUpperCase());
  const _excludeCryptos = excludeCryptos?.map((id) => id.toUpperCase());

  const _onlyPaymentMethods = onlyPaymentMethods;
  const _excludePaymentMethods = excludePaymentMethods;

  const _onlyFiat = onlyFiat?.map((code) => code.toUpperCase());
  const _excludeFiat = excludeFiat?.map((code) => code.toUpperCase());

  const filtredGateways = gatewaysResponse.gateways
    .map((gateway) => {
      let cryptosList = gateway.cryptoCurrencies;
      let paymentMethodsList = gateway.paymentMethods;
      let fiatList = gateway.fiatCurrencies;

      if (_onlyCryptos && _onlyCryptos?.length > 0)
        cryptosList = cryptosList.filter((crypto) =>
          _onlyCryptos.includes(crypto.id)
        );
      if (_excludeCryptos && _excludeCryptos?.length > 0)
        cryptosList = cryptosList.filter(
          (crypto) => !_excludeCryptos.includes(crypto.id)
        );

      if (_onlyPaymentMethods && _onlyPaymentMethods?.length > 0)
        paymentMethodsList = paymentMethodsList.filter((paymentMethod) =>
          _onlyPaymentMethods.includes(paymentMethod)
        );
      if (_excludePaymentMethods && _excludePaymentMethods?.length > 0)
        paymentMethodsList = paymentMethodsList.filter(
          (paymentMethod) => !_excludePaymentMethods.includes(paymentMethod)
        );

      if (_onlyFiat && _onlyFiat?.length > 0)
        fiatList = fiatList.filter((fiat) => _onlyFiat.includes(fiat.code));
      if (_excludeFiat && _excludeFiat?.length > 0)
        fiatList = fiatList.filter((fiat) => !_excludeFiat.includes(fiat.code));

      return {
        ...gateway,
        cryptoCurrencies: cryptosList,
        paymentMethods: paymentMethodsList,
        fiatCurrencies: fiatList,
      };
    })
    .filter((gateway) => {
      if (onlyGateways === undefined) {
        return true;
      }
      return onlyGateways.includes(gateway.identifier);
    });
  return {
    ...gatewaysResponse,
    gateways: filtredGateways,
  };
};

const sortCryptoByRecommended = (
  availableCryptos: Currency[],
  recommendedCryptoCurrencies?: string[]
): Currency[] => {
  if (!recommendedCryptoCurrencies) return availableCryptos;

  return availableCryptos.sort((c1: Currency, c2: Currency) => {
    const c1Index = recommendedCryptoCurrencies.indexOf(c1.id);
    const c2Index = recommendedCryptoCurrencies.indexOf(c2.id);

    if (c1Index === c2Index) return 0;
    if (c2Index === -1) return -1;
    if (c1Index === -1) return 1;
    return c1Index < c2Index ? -1 : 1;
  });
};

type DefaultAddrs = {
  [denom: string]: CryptoAddrType | undefined;
};

const filterRatesResponse = (
  ratesResponse: RateResponse,
  onlyGateways?: string[],
  defaultAddrs?: DefaultAddrs,
  selectedCrypto?: string
): RateResponse => {
  return ratesResponse.filter((gateway) => {
    if (
      onlyGateways !== undefined &&
      !onlyGateways.includes(gateway.identifier)
    ) {
      return false;
    }
    if (defaultAddrs !== undefined && selectedCrypto !== undefined) {
      const memoUsed = defaultAddrs[selectedCrypto]?.memo !== undefined;
      if (memoUsed) {
        const nextStep = gateway.nextStep;
        if (
          nextStep !== undefined &&
          nextStep.type === "form" &&
          !nextStep.data.some(
            (data) => data.name === "cryptocurrencyAddressTag"
          )
        ) {
          return false;
        }
      }
    }
    return true;
  });
};

interface SellParams {
  country?: string;
  amountInCrypto?: boolean;
}

const sell = async (
  crypto: string,
  amount: number,
  paymentMethod: string,
  params?: SellParams
): Promise<GatewayRate> => {
  const urlParams = createUrlParamsFromObject(params ?? {});
  const ratesUrl = `${BASE_API}/sell/${crypto}/${paymentMethod}/${amount}?${urlParams}`;
  logRequest(ratesUrl);
  const ratesRes = await fetch(ratesUrl, {
    headers,
    credentials: process.env.STAGE === "local" ? "omit" : "include",
  });
  const rates: GatewayRate = await processResponse(ratesRes);
  return rates;
};

export {
  authenticate,
  gateways,
  rate,
  executeStep,
  filterGatewaysResponse,
  sortCryptoByRecommended,
  filterRatesResponse,
  getAcceptLanguageParameter,
  updateAcceptLanguageParameter,
  sell,
  NextStepError,
  sentryHub,
  ApiError,
};
