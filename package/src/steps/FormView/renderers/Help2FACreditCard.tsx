import React from "react";
import stylesCommon from "../../../styles.module.css";
import help2faCc from "../../../icons/help_2fa_cc.jpg";

type Help2FACreditCardType = {};

const Help2FACreditCard: React.FC<Help2FACreditCardType> = () => {
  const helpText = `A small transaction was charged on your credit card
                        with a 6-digit verification code in the description.
                        Check your credit card transactions, copy the code
                        and fill it in here.`;
  return (
    <>
      <h4 className={stylesCommon["help-title"]}>2FA Credit Card</h4>
      <p className={stylesCommon["help-text"]}>{helpText}</p>
      <img
        className={stylesCommon["help-img"]}
        src={help2faCc}
        alt="Pending transaction screenshot"
      />
    </>
  );
};

export default Help2FACreditCard;
