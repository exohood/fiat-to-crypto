import React, { useContext, useState, useEffect } from "react";
import stylesCommon from "../../styles.module.css";
import styles from "./styles.module.css";

import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext";
import BuyCryptoView from "../../BuyCryptoView";

import { ReactComponent as TICK_GREEN } from "../../icons/success_green.svg";
import { ReactComponent as TICK_BLUE } from "../../icons/success_blue.svg";
import Footer from "../../common/Footer";

type BodySuccessViewType = {
  txType: "instant" | "pending";
  trackingURL?: string;
};

const BodySuccessView: React.FC<BodySuccessViewType> = (props) => {
  const [title] = useState("Your order is being processed");
  const [info, setInfo] = useState(
    "The seller has received your order and will handle the rest of the transaction. You will receive your cryptocurrency in the provided wallet address soon."
  );
  const { onlyScreen } = useContext(NavContext);
  const { collected } = useContext(APIContext);

  useEffect(() => {
    if (collected.selectedGateway?.identifier === "Moonpay")
      setInfo(
        "The seller has received your order and will handle the rest of the transaction. A confirmation email has been sent with information about how to track your transaction."
      );
  }, [collected.selectedGateway]);

  return (
    <main className={`${stylesCommon.body}`}>
      <div
        className={`${stylesCommon.body__child} ${stylesCommon.grow} ${styles.body}`}
      >
        {props.txType === "instant" ? (
          <TICK_GREEN className={styles["success-icon"]} />
        ) : (
          <TICK_BLUE className={styles["success-icon"]} />
        )}
        <span className={styles.title}>
          {props.txType === "instant"
            ? title
            : "Your transaction is waiting for payment"}
        </span>
        <span className={styles.info}>
          {props.txType === "instant"
            ? info
            : "Complete the payment to get your cryptos. We sent you the instructions and the payment info to your email."}
        </span>
        {props.txType === "instant" && props.trackingURL && (
          <>
            <button
              onClick={() => window.open(props.trackingURL)}
              className={`${styles["button--basic"]} ${styles["button--tracking"]}`}
            >
              Track your transaction
            </button>
            <hr className={stylesCommon.divisor}></hr>
          </>
        )}
        {props.txType === "pending" && false && (
          <span className={styles["button--link"]}>
            Download your payment info
          </span>
        )}
        <button
          onClick={
            collected.redirectURL
              ? () => window.open(collected.redirectURL, "_parent")
              : () => onlyScreen(<BuyCryptoView />)
          }
          className={`${styles["button--basic"]} ${
            props.txType === "pending"
              ? styles["button--pending"]
              : styles["button--instant"]
          } ${styles["finish-btn"]}`}
        >
          {collected.redirectURL ? "Finish" : "Buy more crypto"}
        </button>
      </div>
      <Footer />
    </main>
  );
};

BodySuccessView.defaultProps = {};

export default BodySuccessView;
