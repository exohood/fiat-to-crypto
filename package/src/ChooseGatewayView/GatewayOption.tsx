import React, { useContext, useEffect, useState, useCallback } from "react";
import styles from "./styles.module.css";
import commonStyles from "./../styles.module.css";
import { APIContext } from "../ApiContext";
import { badgeItemMap } from "./constants";
import { GateWayOptionProps, BadgeType } from "./ChooseGatewayView.models";
import { ReactComponent as ArrowUpSvg } from "../icons/arrow-up.svg";
import Checkbox from "../common/Checkbox/Checkbox";

const GatewayOption: React.FC<GateWayOptionProps> = (props) => {
  const { collected } = useContext(APIContext);
  const [badgeList, setBadgeList] = useState<{ label: string; icon: string }[]>(
    []
  );
  const [percentage, setPercentage] = useState((0).toFixed(2));

  const percentTransRef = React.useRef(null);
  const amountLabelTransRef = React.useRef(null);
  const wrapperTransRef = React.useRef(null);

  const isAnOption = props.error?.type === "OPTION";

  const getPercentage = useCallback(() => {
    const receivedCrypto = props.receivedCrypto || 0;
    const selectedReceivedCrypto = props.selectedReceivedCrypto || 0;

    const diffPercent =
      receivedCrypto > selectedReceivedCrypto
        ? (receivedCrypto / selectedReceivedCrypto - 1) * 100
        : (1 - receivedCrypto / selectedReceivedCrypto) * 100;

    return diffPercent.toFixed(2);
  }, [props.receivedCrypto, props.selectedReceivedCrypto]);

  const getReceivedAmount = useCallback(() => {
    const receivedCrypto = props.receivedCrypto || 0;

    const name = collected.amountInCrypto
      ? collected.selectedCurrency?.name
      : collected.selectedCrypto?.name;
    const amount = collected.amountInCrypto
      ? receivedCrypto
      : receivedCrypto.toFixed(5);
    return `${name} ${amount}`;
  }, [
    collected.amountInCrypto,
    collected.selectedCrypto?.name,
    collected.selectedCurrency?.name,
    props.receivedCrypto,
  ]);

  const getMainBadge = useCallback(() => {
    if (!props.stats) {
      return;
    }

    if (props.stats[props.name]?.cheapest) {
      return badgeItemMap[BadgeType.Cheapest];
    }

    if (props.stats[props.name]?.fast) {
      return badgeItemMap[BadgeType.Fast];
    }

    return undefined;
  }, [props.name, props.stats]);

  const updateBadgeList = useCallback(() => {
    const results = [];

    const mainBadge = getMainBadge();
    if (mainBadge) {
      results.push(mainBadge);
    }

    if (props.stats?.[props.name].noId) {
      results.push(badgeItemMap[BadgeType.NoIdRequired]);
    }

    setBadgeList(results);
  }, [getMainBadge, props.stats, props.name]);

  const isPercentageVisible = useCallback(() => {
    return (
      props.available &&
      !props.isOpen &&
      !isAnOption &&
      !props.error?.type.match(/MIN|MAX/)
    );
  }, [isAnOption, props.available, props.error?.type, props.isOpen]);

  const getSyleColorUpDownDiff = useCallback(() => {
    return {
      "--diff-up-color": collected.amountInCrypto
        ? "var(--error-color)"
        : "var(--success-color)",
      "--diff-down-color": collected.amountInCrypto
        ? "var(--success-color)"
        : "var(--error-color)",
      visibility: isPercentageVisible() ? "visible" : "hidden",
    } as React.CSSProperties;
  }, [collected.amountInCrypto, isPercentageVisible]);

  useEffect(() => {
    updateBadgeList();
  }, [updateBadgeList]);

  useEffect(() => {
    if (isPercentageVisible()) {
      setPercentage(getPercentage());
    }
  }, [getPercentage, isPercentageVisible]);

  const isSelected = props.available && props.isOpen;
  const isDiffPositive =
    (props.receivedCrypto || 0) > (props.selectedReceivedCrypto || 0);

  return (
    <li
      ref={wrapperTransRef}
      className={`${styles["option-wrapper"]} ${
        isSelected ? styles["option-wrapper-selected"] : ""
      } ${!props.available ? styles["option-container-disabled"] : ""}`}
      onClick={() => props.onClick?.()}
    >
      <Checkbox
        className={styles["option-checkbox"]}
        checked={isSelected}
        disabled={!props.available}
      />
      <div
        className={`${commonStyles["flex-all"]} ${styles["icon-container"]}`}
      >
        <img alt="icon-gateway" src={props.icon} />
      </div>

      <div className={styles["option-info-wrapper"]}>
        <div className={styles["option-title"]}>{props.name}</div>
        <div className={styles["option-badges-wrapper"]}>
          {badgeList.map((item, index) => (
            <div key={index} className={styles["badge-wrapper"]}>
              {item.icon && (
                <img
                  className={styles["badge-icon"]}
                  src={item.icon}
                  alt="icon-badge"
                />
              )}
              <div
                className={`${styles["tag-text"]} ${commonStyles["txt-no-wrap"]}`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {!!props.duration && props.available && (
          <div
            className={`${styles["tag-text"]} ${commonStyles["txt-no-wrap"]} ${styles["duration-field"]}`}
          >
            {props.duration.message}
          </div>
        )}

        {!props.available && (
          <div className={`${styles["tag-text"]}`}>
            {props.error?.message || "Try again later"}
          </div>
        )}
      </div>

      {props.available && (
        <div className={styles["option-right-wrapper"]}>
          <div className={styles["option-right-sub"]}>
            <div
              className={`${styles["amount-wrapper"]} ${
                isSelected ? styles["selected"] : ""
              }`}
            >
              <div
                ref={amountLabelTransRef}
                className={`${styles["tag-text"]} ${commonStyles["txt-no-wrap"]} ${styles["amount-label"]}`}
              >
                {collected.amountInCrypto ? "You pay:" : "You receive:"}
              </div>

              <div className={styles["amount"]}>{getReceivedAmount()}</div>

              <div
                ref={percentTransRef}
                style={getSyleColorUpDownDiff()}
                className={`${styles["percentage-wrapper"]} ${
                  !isDiffPositive ? styles["diff-down"] : ""
                }`}
              >
                {`${percentage}%`}
                <ArrowUpSvg className={styles["percentage-arrow"]} />
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default GatewayOption;
