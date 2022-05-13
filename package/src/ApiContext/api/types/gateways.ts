interface GatewaysResponse {
  gateways: IGatewayItem[];
  localization: {
    country: string;
    state: string | null;
    currency: string;
  };
  icons?: {
    [key: string]: IconGatewaysResponse;
  };
  defaultAmounts?: {
    [key: string]: number;
  };
}

interface Currency {
  code: string; // display only
  id: string; // internal id e.g. bnb-bep20
  precision: number;
  network?: string;
  displayName?: string;
  supportsAddressTag?: boolean;
}

interface IconGatewaysResponse {
  name: string;
  icon: string;
  symbol?: string;
}

interface IGatewayItem {
  identifier: string;
  paymentMethods: string[];
  fiatCurrencies: Currency[];
  cryptoCurrencies: Currency[];
}

export type { GatewaysResponse, IconGatewaysResponse, IGatewayItem, Currency };
