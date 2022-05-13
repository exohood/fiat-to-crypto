import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import stylesCommon from "../../styles.module.css";
import {
  COUNTRY_NOT_SUPPORTED,
  DISABLED_GATEWAYS,
  API_ERROR,
  NO_ITEMS_FOUND,
  CRASH_ERROR,
} from "./errors";

import { NavContext } from "../../NavContext";
import BuyCryptoView from "../../BuyCryptoView";
import { APIContext } from "../../ApiContext";
import Footer from "../Footer";
import ProgressHeader from "../Header/ProgressHeader/ProgressHeader";

interface ErrorViewProps {
  buttonText?: string;
  maxHeight?: string;
  fixedHeight?: boolean;
  type?:
    | "API"
    | "NO_GATEWAYS"
    | "DISABLED_GATEWAYS"
    | "NO_ITEMS"
    | "NO_RATES"
    | "MIN"
    | "MAX"
    | "UNREACHABLE"
    | "OTHER"
    | "ALL_UNAVAILABLE"
    | undefined
    | "OPTION"
    | "CRASH";
  message?: string;
  callback?: () => any;
}

const ErrorView: React.FC<ErrorViewProps> = (props) => {
  const { onlyScreen } = useContext(NavContext);
  const { apiInterface, collected, data } = useContext(APIContext);

  const [isRestartCalled, setIsRestartCalled] = useState(false);

  const restartWidget = () => {
    apiInterface.clearErrors();
    data.restartWidget();
    setIsRestartCalled(true);
  };

  useEffect(() => {
    if (isRestartCalled && !collected.errors) {
      onlyScreen(<BuyCryptoView />);
      setIsRestartCalled(false);
    }
  }, [collected.errors, isRestartCalled, onlyScreen]);

  const CurrentError = (() => {
    switch (props.type) {
      case "NO_ITEMS":
        return NO_ITEMS_FOUND(props.message);
      case "NO_GATEWAYS":
        return COUNTRY_NOT_SUPPORTED(collected.selectedCountry);
      case "DISABLED_GATEWAYS":
        return DISABLED_GATEWAYS;
      case "API":
        return API_ERROR(props.message ?? "", restartWidget);
      case "CRASH":
        return CRASH_ERROR(() => {
          props.callback?.();
          restartWidget();
        });
      default:
        return API_ERROR(props.message ?? "", restartWidget);
    }
  })();

  return (
    <>
      <div className={stylesCommon.view}>
        {props.type !== "CRASH" && <ProgressHeader noSeparator />}
        <div className={`${stylesCommon.body} ${styles.body}`}>
          {CurrentError}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ErrorView;
