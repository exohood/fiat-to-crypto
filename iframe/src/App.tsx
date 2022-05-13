import React, { useEffect } from "react";
import TagManager from "react-gtm-module";
import OnramperWidget, { Onramper } from "@onramper/widget";

const com_key = "pk_prod_trQ0nGBcmU_JY41N8Tl50Q00";
const dev_key = "pk_test_oDsXkHokDdr06zZ0_sxJGw00";
const l2_key = "pk_test_RJ3mpUzEyukuEvCeCvyByDY0B0zsDD1myjYUhRhu0480";

const defaultApiKey =
  window.self !== window.top
    ? undefined
    : process.env.REACT_APP_STAGE === "l2"
    ? l2_key
    : window.location.origin.split(".")[2] === "com"
    ? com_key
    : dev_key;

const apiKey = getParam("apiKey", defaultApiKey);
const defaultColor = `#${getParam("color", "0316C1")}`;
const fontFamily = getParam("fontFamily", "'Inter', sans-serif");
const defaultAmount = Number(getParam("defaultAmount", "200"));
const defaultCrypto = getParam("defaultCrypto", "BTC");
const defaultFiat = getParam("defaultFiat");
const defaultFiatSoft = getParam("defaultFiatSoft");
const defaultPaymentMethod = getParam("defaultPaymentMethod");
const addresses = getAddressesParam();
const onlyCryptos = getArrayParam("onlyCryptos");
const excludeCryptos = getArrayParam("excludeCryptos");
const onlyPaymentMethods = getArrayParam("onlyPaymentMethods");
const excludePaymentMethods = getArrayParam("excludePaymentMethods");
const excludeFiat = getArrayParam("excludeFiat");
const onlyGateways = getArrayParam("onlyGateways");
const onlyFiat = getArrayParam("onlyFiat");
const country = getParam("country");
const language = getParam("language");
const isAddressEditable = getParam("isAddressEditable");
const wallets = getWalletsParam();
const displayChatBubble = getParam("displayChatBubble", "false");
const amountInCrypto = getParam("amountInCrypto");
const gFontPath = getParam(
  "gFontPath",
  "css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
);
const partnerContext = getJSONParam("partnerContext", undefined);
const redirectURL = getParam("redirectURL", undefined);
const minAmountEur = Number(getParam("minAmountEur", "0"));
const supportSell = getParam("supportSell", "true") === "true";
const supportBuy = getParam("supportBuy", "true") === "true";
const isAmountEditable = getParam("isAmountEditable", "true") === "true";
const recommendedCryptoCurrencies = getArrayParam(
  "recommendedCryptoCurrencies"
);
const darkMode = getParam("darkMode");

if (gFontPath) loadGoogleFont(gFontPath);

Onramper.on(Onramper.EVENTS.ALL, (context) => {
  window.parent.postMessage(context, "*"); //  `*` on any domain
});

function App() {
  const style = {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    backgroundColor: inIframe() ? "transparent" : "whitesmoke",
  } as React.CSSProperties;

  // Google Tag Manager
  useEffect(() => {
    const tagManagerArgs = {
      gtmId: process.env.REACT_APP_GTM_ID ?? '',
      dataLayer: {
        apiKey: apiKey,
      },
    };
    TagManager.initialize(tagManagerArgs);
  }, []);

  return (
    <>
      <div style={style}>
        {/*         <div className={'onramper-pane'}></div> */}
        <div className={"widget-container"}>
          <OnramperWidget
            API_KEY={apiKey}
            color={defaultColor}
            fontFamily={fontFamily}
            defaultAddrs={wallets || addresses}
            defaultAmount={defaultAmount}
            defaultCrypto={defaultCrypto}
            defaultFiat={defaultFiat}
            defaultFiatSoft={defaultFiatSoft}
            defaultPaymentMethod={defaultPaymentMethod}
            filters={{
              onlyCryptos: onlyCryptos,
              excludeCryptos: excludeCryptos,
              onlyPaymentMethods: onlyPaymentMethods,
              excludePaymentMethods: excludePaymentMethods,
              excludeFiat: excludeFiat,
              onlyGateways: onlyGateways,
              onlyFiat: onlyFiat,
            }}
            country={country}
            language={language}
            isAddressEditable={
              isAddressEditable === undefined
                ? undefined
                : isAddressEditable === "true"
            }
            displayChatBubble={
              displayChatBubble === undefined
                ? undefined
                : displayChatBubble === "true"
            }
            amountInCrypto={
              amountInCrypto === undefined
                ? undefined
                : amountInCrypto === "true"
            }
            partnerContext={partnerContext}
            redirectURL={redirectURL}
            minAmountEur={minAmountEur}
            supportSell={supportSell}
            supportBuy={supportBuy}
            isAmountEditable={isAmountEditable}
            recommendedCryptoCurrencies={recommendedCryptoCurrencies}
            darkMode={darkMode === "true"}
          />
        </div>
      </div>
    </>
  );
}

function getParam(name: string, defaultValue?: string): string | undefined {
  const value = new URLSearchParams(window.location.search).get(name);
  if (value === null) return defaultValue;
  try {
    return decodeURIComponent(value);
  } catch (error) {
    throw new Error(`Couldn't decode ${name} parameter!`);
  }
}

function getArrayParam(paramName: string, defaultValue?: string[]) {
  return getParam(paramName, defaultValue?.join(","))
    ?.split(",")
    .map((code) => code.trim());
}

function getWalletsParam() {
  return getParam("wallets", undefined)
    ?.split(",")
    .reduce((acc, wallet) => {
      const paramSplitted = wallet.split(":");
      const denom = paramSplitted[0];
      const walletAddr = paramSplitted.slice(1).join(":").split(";");
      if (walletAddr && walletAddr.length > 2) return acc;
      let address;
      let memo;
      if (walletAddr.length >= 1) address = walletAddr[0];
      if (walletAddr.length === 2) memo = walletAddr[1];
      return {
        ...acc,
        [denom]: { address, memo },
      };
    }, {});
}

function getAddressesParam() {
  const addrs = JSON.parse(getParam("addresses", "{}") ?? "{}");
  return Object.entries(addrs).reduce((acc, [key, address]) => {
    return {
      ...acc,
      [key]: { address },
    };
  }, {});
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function loadGoogleFont(gFontPath: string) {
  const css = `@import url('https://fonts.googleapis.com/${gFontPath}');`;
  const head = document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(css));
  /* head.appendChild(style); */
  head.prepend(style);
}

function getJSONParam(name: string, defaultValue?: string) {
  try {
    const value = new URLSearchParams(window.location.search).get(name);
    if (!value) return defaultValue;
    return JSON.parse(decodeURIComponent(value));
  } catch (error) {
    throw new Error(`Invalid value for ${name} parameter!`);
  }
}

export default App;
