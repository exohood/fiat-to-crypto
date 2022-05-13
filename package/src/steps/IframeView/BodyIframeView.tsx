import React, { useEffect, useState, useCallback, useContext } from "react";
import stylesCommon from "../../styles.module.css";
import styles from "./styles.module.css";

import InfoBox from "../../common/InfoBox";

import {
  SANDBOX_HOSTNAME,
  MOONPAY_HOSTNAME,
  COINIFY_HOSTNAME,
} from "../../ApiContext/api/constants";
import { APIContext } from "../../ApiContext";
import { NavContext } from "../../NavContext";

import BuyCryptoView from "../../BuyCryptoView";
import ButtonAction from "../../common/ButtonAction";
import ChooseGatewayView from "../../ChooseGatewayView/ChooseGatewayView";
import Footer from "../../common/Footer";

interface BodyIframeViewType {
  src: string;
  type: string;
  textInfo?: string;
  error?: string;
  fatalError?: string;
  onErrorDismissClick: (type?: string) => void;
  isFullScreen?: boolean;
  features?: string;
}

const getHostname = (href: string) => {
  const location = document.createElement("a");
  location.href = href;
  // IE doesn't Fpopulate all link properties when setting .href with a relative URL,
  // however .href will return an absolute URL which then can be used on itself
  // to populate these additional fields.
  if (location.host === "") {
    location.href = location.href; // eslint-disable-line no-self-assign
  }
  return location.hostname;
};

const BodyIframeView: React.FC<BodyIframeViewType> = (props) => {
  const { textInfo, type, error } = props;
  const [autoRedirect, setAutoRedirect] = useState(true);
  /* const [isAGateway, setisAGateway] = useState(true) */
  const [iframeUrl, setIframeUrl] = useState(props.src);
  const [countDown, setCountDown] = useState(textInfo ? 10 : 3);

  const [userClosedPopup, setUserClosedPopup] = useState(false);

  const { collected, apiInterface } = useContext(APIContext);
  const { selectedGateway } = collected;
  const [isRestartCalled, setIsRestartCalled] = useState(false);

  const { onlyScreen, nextScreen } = useContext(NavContext);

  const hostname = getHostname(props.src);
  const isAGateway =
    selectedGateway?.nextStep?.type === "redirect" &&
    hostname === getHostname(selectedGateway?.nextStep.url);

  const restartWidget = () => {
    apiInterface.clearErrors();
    setIsRestartCalled(true);
  };

  useEffect(() => {
    if (isRestartCalled && !collected.errors) {
      onlyScreen(<BuyCryptoView />);
      if (props.fatalError) nextScreen(<ChooseGatewayView />);
      setIsRestartCalled(false);
    }
  }, [
    collected.errors,
    isRestartCalled,
    onlyScreen,
    nextScreen,
    props.fatalError,
  ]);

  const redirect = useCallback(async (url: string) => {
    setAutoRedirect(true);
    //try to open popup
    const windowObjectReference = window.open(
      url,
      "_blank",
      "height=595,width=440,scrollbars=yes,left=0"
    ); //todo: add config
    //if opened -> all is ok
    if (windowObjectReference) {
      const interval = 250;
      const times2Count = (1000 * 60) / interval;
      let count = 0;
      const checkIfClosed = setInterval(() => {
        if (windowObjectReference.closed || count > times2Count) {
          setUserClosedPopup(true);
          clearInterval(checkIfClosed);
        }
        count++;
      }, interval);
      return;
    }
    //if not opened -> warn user about popup blocked + ask user for click a button
    setAutoRedirect(false);
  }, []);

  useEffect(() => {
    let urlTail = "";
    const hostname = getHostname(props.src).split(".").splice(1).join(".");
    //const main = window.document.getElementById('main')
    const primaryColor = collected.themeColor; //main !== null ? getComputedStyle(main).getPropertyValue('--primary-color').replace('#', '') : undefined
    if (primaryColor)
      if (hostname === SANDBOX_HOSTNAME) {
        urlTail = `${props.src.includes("?") ? "&" : "?"}color=${primaryColor}`;
      } else if (hostname === MOONPAY_HOSTNAME) {
        urlTail = `${
          props.src.includes("?") ? "&" : "?"
        }colorCode=%23${primaryColor}`;
      } else if (hostname === COINIFY_HOSTNAME) {
        urlTail = `${
          props.src.includes("?") ? "&" : "?"
        }primaryColor=${primaryColor}`;
      }

    /* else if (selectedGateway?.nextStep?.type === 'redirect' && hostname === getHostname(selectedGateway?.nextStep.url)) {
            setisAGateway(true)
        } */
    const newIframeUrl = `${props.src}${urlTail}`;
    setIframeUrl(newIframeUrl);
  }, [props.src, redirect, type, selectedGateway, collected.themeColor]);

  useEffect(() => {
    if (countDown <= 0 || !isAGateway) {
      if (type === "redirect") redirect(iframeUrl);
      return;
    }
    let countDownId: ReturnType<typeof setTimeout>;
    if (isAGateway) {
      countDownId = setTimeout(() => {
        setCountDown((old) => --old);
      }, 1000);
    }
    return () => clearTimeout(countDownId);
  }, [isAGateway, countDown, iframeUrl, redirect, type]);

  return (
    <main
      className={`${stylesCommon.body} ${
        props.isFullScreen ? stylesCommon["body--full_screen"] : ""
      } ${styles.body}`}
    >
      {
        <InfoBox
          in={!!textInfo}
          className={`${stylesCommon.body__child} ${styles.body__child}`}
          type="notification"
        >
          {textInfo}
        </InfoBox>
      }
      {!props.isFullScreen && (
        <>
          <InfoBox
            in={!!textInfo && type !== "redirect"}
            className={`${stylesCommon.body__child} ${styles.body__child}`}
          >
            {textInfo}
          </InfoBox>
          <InfoBox
            in={!autoRedirect}
            className={`${stylesCommon.body__child} ${styles.body__child}`}
            type="notification"
          >
            {
              "We couldn't auto-redirect you to finish the process, please click the button below to finish the process."
            }
          </InfoBox>
          <InfoBox
            in={!!error}
            className={`${stylesCommon.body__child} ${styles.body__child}`}
            type="error"
            canBeDismissed
            onDismissClick={() => props.onErrorDismissClick()}
          >
            {error}
          </InfoBox>
          <InfoBox
            in={!!props.fatalError}
            type="error"
            message={props.fatalError}
            className={`${stylesCommon.body__child} ${styles.body__child}`}
            actionText="Try another gateway"
            onActionClick={restartWidget}
            onDismissClick={() => props.onErrorDismissClick("FATAL")}
            canBeDismissed
          >
            <span>
              {
                "It's posible that your bank rejected the transaction. Please. use another credit card or try with another gateway."
              }
            </span>
          </InfoBox>
        </>
      )}
      <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
        {(props.fatalError && (
          <div className={`${styles.center}`}>
            <span>{props.fatalError}</span>
          </div>
        )) ||
          (isAGateway && type === "redirect" && (
            <div className={`${styles.center}`}>
              <div className={styles.block}>
                {countDown <= 0 ? (
                  <>
                    <span>
                      You have been redirected to finish the purchase with{" "}
                      {selectedGateway?.identifier}.
                    </span>
                    <span style={{ width: "50%" }}>
                      If nothing happened, please, click the button below.
                    </span>
                    <span style={{ width: "50%", marginBottom: "1rem" }}>
                      <ButtonAction
                        text="Complete purchase"
                        size="small"
                        onClick={() => redirect(iframeUrl)}
                      />
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      You will be redirected to finish the purchase with{" "}
                      {selectedGateway?.identifier}.
                    </span>
                    <span>
                      <div>Redirecting you in</div>
                      <div style={{ fontSize: "1.5rem" }}>{countDown}</div>
                    </span>
                  </>
                )}
              </div>
              {userClosedPopup && (
                <div className={styles.block} style={{ fontSize: "0.75rem" }}>
                  <hr className={stylesCommon.divisor}></hr>
                  <span>
                    <div>Or, if you already finished the transaction:</div>
                  </span>
                  <span>
                    <ButtonAction
                      text="Buy more crypto"
                      size="small"
                      onClick={restartWidget}
                    />
                  </span>
                </div>
              )}
            </div>
          )) ||
          (type === "redirect" && autoRedirect && (
            <div className={`${styles.center}`}>
              {!userClosedPopup ? (
                <>
                  <span>Redirecting you to finish the process...</span>
                  <span>
                    A new window should be opened, if not, click the button
                    below to finish the process.{" "}
                  </span>
                  <span style={{ width: "40%" }}>
                    <ButtonAction
                      text="Finish process"
                      size="small"
                      onClick={() => redirect(iframeUrl)}
                    />
                  </span>
                </>
              ) : (
                <div className={styles.block}>
                  <span>
                    A new window should have been opened to complete the
                    transaction
                  </span>
                  <hr className={stylesCommon.divisor}></hr>
                  <span>
                    <div>If you already completed the transaction</div>
                  </span>
                  <span style={{ width: "40%" }}>
                    <ButtonAction
                      text="Buy more crypto"
                      size="small"
                      onClick={restartWidget}
                    />
                  </span>
                </div>
              )}
            </div>
          )) ||
          (type === "redirect" && !autoRedirect && (
            <div className={`${styles.center}`}>
              <span className={`${stylesCommon.body__child} `}>
                Please, click the button below to finish the process.{" "}
              </span>
              <span style={{ width: "30%" }}>
                <ButtonAction
                  text="Finish process"
                  size="small"
                  onClick={() => redirect(iframeUrl)}
                />
              </span>
            </div>
          )) || (
            <iframe
              title="Sandbox"
              src={iframeUrl}
              allow={props.features}
              style={{
                width: "100%",
                minHeight: "100%",
                borderStyle: "none",
              }}
            />
          )}
      </div>
      <Footer className={stylesCommon["mg-t-0"]} />
    </main>
  );
};

export default BodyIframeView;
