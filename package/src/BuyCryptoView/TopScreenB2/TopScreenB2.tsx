import React from "react";
import styles from "./TopScreenB2.module.css";
import CurrencyInput from "./CurrencyInput/CurrencyInput";
import CurrencySwitcher from "./CurrencySwitcher/CurrencySwitcher";
import ExpectedAmountPreview from "./ExpectedAmountPreview/ExpectedAmountPreview";
import { useTranslation } from "react-i18next";

const TopScreenB: React.FC<{}> = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles["heading"]}>{t("buyCryptoView.heading")}</div>

      <div className={styles["exchange-ui-wrapper"]}>
        <CurrencyInput />
        <ExpectedAmountPreview />
        <CurrencySwitcher />
      </div>
    </>
  );
};

export default TopScreenB;
