export enum GtmEvent {
  FIAT_TO_CRYPTO = "fiat-to-crypto",
  CRYPTO_TO_FIAT = "crypto-to-fiat",
  ELEMENT_CLICK = "element-click",
}

export enum GtmEventAction {
  OUT_CURRENCY_SELECTION = "outCurrencySelection",
  IN_CURRENCY_SELECTION = "inCurrencySelection",
  IN_CURRENCY_SEARCH = "inCurrencySearch",
  OUT_CURRENCY_SEARCH = "outCurrencySearch",
  IN_CURRENCY_CLOSE = "inCurrencyClose",
  OUT_CURRENCY_CLOSE = "outCurrencyClose",
  CURRENCY_CLOSE = "currencyClose",
  CURRENCY_SEARCH = "currencySearch",
  FAQ_MENU_LINK = "faqMenuLink",
  PRIVACY_POLICY_MENU_LINK = "privacyPolicyMenuLink",
  TERMS_OF_USAGE_MENU_LINK = "termsOfUsageMunuLink",
  MOONPAY_SUPPORT_LINK = "moonPaySupportMenuLink",
  UNISWAP_SUPPORT_MENU_LINK = "uniswapSupportMenuLink",
  MENU_CLOSE = "menuClose",
}

export enum GtmEventLabel {
  IN_CURRENCY_SEARCH = "inCurrencySearch",
  OUT_CURRENCY_SEARCH = "outCurrencySearch",
  IN_CURRENCY_CLOSE = "inCurrencyClose",
  OUT_CURRENCY_CLOSE = "outCurrencyClose",
  MENU_CLOSE = "menuClose",
}

export enum GtmEventCategory {
  DROPDOWN_VALUE = "dropdownValue",
  FIELD = "field",
  BUTTON = "button",
  LINK = "link",
}

export enum MenuItem {
  "faq" = GtmEventAction.FAQ_MENU_LINK,
  "privacy-policy" = GtmEventAction.PRIVACY_POLICY_MENU_LINK,
  "terms" = GtmEventAction.TERMS_OF_USAGE_MENU_LINK,
  "support-moonpay" = GtmEventAction.MOONPAY_SUPPORT_LINK,
  "support-uniswap" = GtmEventAction.UNISWAP_SUPPORT_MENU_LINK,
}
