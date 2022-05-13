import React from "react";
import ReactDOM from "react-dom";
import BuyCryptoView from "./BuyCryptoView";
import ErrorView from "./common/ErrorView";
import styles from "./styles.module.css";
import { NavProvider, NavContainer } from "./NavContext";
import { APIProvider } from "./ApiContext";
import type { APIProviderType } from "./ApiContext";
import "./polyfills/composedpath.polyfill";
import { ErrorBoundary } from "@sentry/react";
import { on, EVENTS } from "./Onramper";

import "./i18n/config";

import "./isolateinheritance.css";
import "./normalize.min.css";

type OnramperWidgetProps = Omit<APIProviderType, "themeColor"> & {
  color?: string;
  fontFamily?: string;
  className?: string;
  displayChatBubble?: boolean;
};

const OnramperWidget: React.FC<OnramperWidgetProps> = (props) => {
  const [flagRestart, setFlagRestart] = React.useState(0);

  const {
    color = "#0316C1",
    fontFamily = props.fontFamily,
    className = "",
  } = props;

  const style = {
    "--primary-color": color,
    "--font-family": fontFamily,
  } as React.CSSProperties;

  return (
    <div
      key={flagRestart}
      id="main"
      style={style}
      className={`isolate-inheritance ${styles.theme} ${className} ${
        props.darkMode ? styles.dark : ""
      }`}
    >
      <ErrorBoundary
        fallback={({ resetError }) => (
          <ErrorView type="CRASH" callback={resetError} />
        )}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
          setFlagRestart((old) => ++old);
        }}
      >
        <NavProvider>
          <APIProvider
            API_KEY={props.API_KEY}
            defaultAmount={props.defaultAmount}
            defaultAddrs={props.defaultAddrs}
            defaultCrypto={props.defaultCrypto}
            defaultFiat={props.defaultFiat}
            defaultFiatSoft={props.defaultFiatSoft}
            defaultPaymentMethod={props.defaultPaymentMethod}
            filters={props.filters}
            country={props.country}
            language={props.language}
            isAddressEditable={props.isAddressEditable}
            themeColor={color.slice(1)}
            displayChatBubble={props.displayChatBubble}
            amountInCrypto={props.amountInCrypto}
            partnerContext={props.partnerContext}
            redirectURL={props.redirectURL}
            minAmountEur={props.minAmountEur}
            supportSell={props.supportSell}
            supportBuy={props.supportBuy}
            isAmountEditable={props.isAmountEditable}
            recommendedCryptoCurrencies={props.recommendedCryptoCurrencies}
          >
            <div style={{ flexGrow: 1, display: "flex" }}>
              <NavContainer home={<BuyCryptoView />} />
            </div>
          </APIProvider>
        </NavProvider>
      </ErrorBoundary>
    </div>
  );
};

const initialize = (selector: string, props: OnramperWidgetProps) => {
  const domContainer = document.querySelector(selector);
  ReactDOM.render(<OnramperWidget {...props} />, domContainer);
};

export interface EventContext {
  type: string;
  gateway: string;
  trackingUrl?: string;
}

const ev = { ...EVENTS };
const Onramper = {
  on,
  EVENTS: ev,
} as {
  on: (event_type: string, cb: (ctx: EventContext) => void) => void;
  EVENTS: typeof ev;
};

export default (props: OnramperWidgetProps) => <OnramperWidget {...props} />;
export { initialize, Onramper };
