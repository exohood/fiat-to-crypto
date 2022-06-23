export const documents = [
  "passport",
  "nationalIdentityCard",
  "residenceCard",
  "driverLicense",
];

export const BASE_API =
  process.env.STAGE === "local"
    ? "http://localhost:3000/dev"
    : process.env.STAGE === "l2"
    ? "https://l2.onramper.tech"
    : process.env.STAGE === "prod"
    ? "https://onramper.tech"
    : "https://staging.onramper.tech";

export const SANDBOX_HOSTNAME =
  process.env.STAGE === "prod"
    ? "sandbox.onramper.tech"
    : "sandbox.staging.onramper.tech";

export const MERCURYO_HOSTNAME = "exchange.mercuryo.io";

export const MOONPAY_HOSTNAME =
  process.env.STAGE === "prod" ? "buy.moonpay.com" : "buy-staging.moonpay.com";

export const COINIFY_HOSTNAME =
  process.env.STAGE === "prod"
    ? "https://trade-ui.coinify.com"
    : "https://trade-ui.sandbox.coinify.com";

export const GTM_ID =
  process.env.STAGE === "prod" ? "GTM-MKWPFXR" : "GTM-W8KDKZR";

export const DEFAULT_GTM_DATA_LAYER = "dataLayer";
