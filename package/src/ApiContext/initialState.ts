import { GatewaysResponse } from "./api/types/gateways";
import { RateResponse, GatewayRate } from "./api/types/rate";
import { NextStep } from "./api/types/nextStep";

export type GatewayRateOption = { id: string; name: string } & GatewayRate;
export type GatewayRateOptionSimple = Pick<
  GatewayRate,
  "identifier" | "icon" | "error"
>;

export interface ItemType {
  id: string;
  name: string;
  info?: string;
  icon?: string;
  iconSvg?: JSX.Element;
  symbol?: string;
  precision?: number;
  currencyType?: string;
  searchWords?: string; //format "word1 word2"
  supportsAddressTag?: boolean;
  network?: string;
}

export enum ItemCategory {
  Crypto = "CRYPTO",
  Currency = "CURRENCY",
  PaymentMethod = "PAYMENT_METHOD",
}

export type StateType = {
  data: DataStateType;
  collected: CollectedStateType;
  inputInterface: InputInterfaceType;
  apiInterface: ApiInterfaceType;
  [key: string]: any;
};

export interface CryptoAddrType {
  address: string;
  memo?: string;
}

export type CollectedStateType = {
  amount: number;
  amountInCrypto?: boolean;
  isCalculatingAmount: boolean;
  selectedCrypto?: ItemType;
  selectedCurrency?: ItemType;
  selectedPaymentMethod?: ItemType;
  selectedGateway?: GatewayRateOption;
  selectedCountry?: string;
  cryptocurrencyAddress?: CryptoAddrType;
  defaultAddrs: {
    [key: string]: CryptoAddrType | undefined;
  };
  errors?: ErrorObjectType;
  isAddressEditable?: boolean;
  themeColor: string;
  displayChatBubble?: boolean;
  partnerContext?: { [key: string]: any };
  isPartnerContextSent: boolean;
  redirectURL?: string;
  supportSell: boolean;
  supportBuy: boolean;
  isAmountEditable?: boolean;
  [key: string]: any;
};

export type ErrorObjectType =
  | {
      GATEWAYS?: {
        type: "API" | "NO_GATEWAYS" | "DISABLED_GATEWAYS" | "NO_ITEMS";
        message: string;
      };
      RATE?: {
        type: TypesOfRateError;
        message: string;
        limit?: number;
      };
    }
  | undefined;

export type TypesOfRateError =
  | "API"
  | "NO_RATES"
  | "MIN"
  | "MAX"
  | "UNREACHABLE"
  | "OTHER"
  | "ALL_UNAVAILABLE"
  | "OPTION";

export type DataStateType = {
  availableCryptos: ItemType[];
  availableCurrencies: ItemType[];
  availablePaymentMethods: ItemType[];
  allRates: GatewayRateOption[];
  handleCryptoChange: (crypto?: ItemType) => undefined | {};
  handleCurrencyChange: (currency?: ItemType) => undefined | {};
  handlePaymentMethodChange: (paymentMehtod?: ItemType) => undefined | {};
  restartWidget: () => void;
  //remote responses
  responseGateways?: GatewaysResponse;
  filtredGatewaysByCrypto: GatewaysResponse["gateways"];
  filtredGatewaysByCurrency: GatewaysResponse["gateways"];
  mappedHiddenByFiat: GatewayRateOptionSimple[];
  responseRate?: RateResponse;
  ICONS_MAP?: {
    [key: string]: { icon: string; name: string; symbol?: string };
  };
};

export type InputInterfaceType = {
  handleInputChange: (name: string, value: any) => void;
};

export type ApiInterfaceType = {
  init: (country?: string) => Promise<ErrorObjectType | undefined | {}>;
  executeStep: (
    step: NextStep,
    params: { [key: string]: any }
  ) => Promise<NextStep>;
  getRates: () => Promise<ErrorObjectType | undefined | {}>;
  clearErrors: () => void;
};

export const initialState: StateType = {
  collected: {
    amount: 100,
    amountInCrypto: undefined,
    isCalculatingAmount: true,
    selectedCrypto: undefined,
    selectedCurrency: undefined,
    selectedPaymentMethod: undefined,
    selectedGateway: undefined,
    selectedCountry: undefined,
    cryptocurrencyAddress: undefined,
    defaultAddrs: {},
    errors: undefined,
    isAddressEditable: true,
    themeColor: "0316C1",
    displayChatBubble: false,
    partnerContext: undefined,
    isPartnerContextSent: false,
    supportSell: true,
    supportBuy: true,
    isAmountEditable: true,
    redirectURL: undefined,
    recommendedCryptoCurrencies: undefined,
  },
  data: {
    availableCryptos: [],
    availableCurrencies: [],
    availablePaymentMethods: [],
    allRates: [],
    handleCryptoChange: () => undefined,
    handleCurrencyChange: () => undefined,
    handlePaymentMethodChange: () => undefined,
    restartWidget: () => undefined,
    responseGateways: undefined,
    filtredGatewaysByCrypto: [],
    filtredGatewaysByCurrency: [],
    responseRate: undefined,
    mappedHiddenByFiat: [],
  },
  inputInterface: {
    handleInputChange: () => null,
  },
  apiInterface: {
    init: async () => undefined,
    executeStep: async (nextStep: NextStep) => nextStep,
    getRates: async () => undefined,
    clearErrors: () => undefined,
  },
};
