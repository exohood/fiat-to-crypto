import React, { useCallback, useContext, useEffect, useState } from "react";
import classes from "./ExpectedAmountPreview.module.css";
import commonClasses from "../../../styles.module.css";
import { APIContext } from "../../../ApiContext";
import ErrorMessage from "../../../common/ErrorMessage/ErrorMessage";
import { ReactComponent as ArrowSwapIcon } from "../../../icons/swap-arrows.svg";
import { useTranslation } from "react-i18next";

const ExpectedAmountPreview: React.FC = () => {
  const { t } = useTranslation();
  const { data, inputInterface, collected } = useContext(APIContext);
  const { handleInputChange } = inputInterface;

  const [expectedCrypto, setExpectedCrypto] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>();

  const unitName = collected.amountInCrypto
    ? collected.selectedCurrency?.name
    : collected.selectedCrypto?.name;

  const swapCategories = useCallback(() => {
    if (collected.bestExpectedCrypto !== 0) {
      inputInterface.handleInputChange("amount", collected.bestExpectedCrypto);
    }
    inputInterface.handleInputChange(
      "amountInCrypto",
      !collected.amountInCrypto
    );

    const inputNode = document.getElementById("editable-amount");
    inputNode && inputNode.focus();
  }, [collected.amountInCrypto, collected.bestExpectedCrypto, inputInterface]);

  useEffect(() => {
    const setAmountByBestRateAvailable = () => {
      let lowest = collected.amountInCrypto
        ? Number.POSITIVE_INFINITY
        : Number.NEGATIVE_INFINITY;
      const comparator = (tmp: number, lowest: number) =>
        collected.amountInCrypto ? tmp < lowest : tmp > lowest;

      const pricedRates = data.allRates.filter((item) => item.available);
      let index = 0;
      let tmp: number;
      for (let i = pricedRates.length - 1; i >= 0; i--) {
        tmp = pricedRates[i].receivedCrypto ?? 0;
        if (comparator(tmp, lowest)) {
          lowest = tmp;
          index = i;
        }
      }

      setExpectedCrypto(pricedRates[index]?.receivedCrypto ?? 0);
    };

    setAmountByBestRateAvailable();
  }, [data.allRates, collected.amountInCrypto]);

  useEffect(() => {
    handleInputChange("bestExpectedCrypto", expectedCrypto);
  }, [expectedCrypto, handleInputChange]);

  useEffect(() => {
    setErrorMessage(
      ["MIN", "MAX"].some((i) => i === collected.errors?.RATE?.type)
        ? collected.errors?.RATE?.message
        : undefined
    );
  }, [collected.errors]);

  if (errorMessage) {
    return (
      <div className={classes["error-text"]}>
        <ErrorMessage text={errorMessage} />
      </div>
    );
  }

  return (
    <div className={classes["text-status"]}>
      {(() => {
        if (collected.isCalculatingAmount) {
          return t("buyCryptoView.fetchingPrice");
        }

        const qtyText = `${expectedCrypto.toFixed(
          collected.amountInCrypto ? 2 : 8
        )} ${unitName}`;
        const qtyDescription = collected.amountInCrypto
          ? t("buyCryptoView.amountYouPay")
          : t("buyCryptoView.youGet");
        return (
          <div
            className={`${classes["crypto-switcher"]} ${commonClasses["clickable-txt"]}`}
            onClick={() => swapCategories()}
          >
            <span>
              {qtyDescription} <strong> {qtyText} </strong>
            </span>
            <ArrowSwapIcon className={classes["swap-icon"]} />
          </div>
        );
      })()}
    </div>
  );
};

export default ExpectedAmountPreview;
