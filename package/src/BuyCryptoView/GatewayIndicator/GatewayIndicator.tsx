import React, { useEffect, useRef, useState } from "react";
import { GatewayIndicatorProps } from "./GatewayIndicator.models";
import arrowDownIcon from "./../../icons/arrow-down.svg";
import styles from "./GatewayIndicator.module.css";
import commonStyles from "./../../styles.module.css";
import Loader from "../../common/Loader/Loader";
import { useTranslation } from "react-i18next";

const Skeleton = React.forwardRef<
  HTMLDivElement,
  { optionLeftStyle: React.CSSProperties }
>((props, ref) => {
  const { t } = useTranslation();

  return (
    <div className={`${styles.wrapper} ${commonStyles["skeleton-wrapper"]}`}>
      <div className={`${styles["option-wrapper"]}`} ref={ref}>
        <span
          className={`${commonStyles["skeleton-box"]} ${styles["sk-image"]}`}
        ></span>
        <div className={`${styles["option-body"]} ${styles["sk-option-body"]}`}>
          <span className={`${styles["option-label"]}`}>
            {t("buyCryptoView.bestRate")}
          </span>
          <span
            className={`${styles["option-handle"]} ${commonStyles["skeleton-box"]}`}
          >
            Lorem
          </span>
        </div>
      </div>
      <div
        className={`${styles["option-info"]} ${commonStyles["skeleton-box"]}`}
        style={props.optionLeftStyle}
      >
        Lorem ipsum dolor sit amet <br /> Lorem ipsum dolor sit amet
      </div>
    </div>
  );
});

const determineRate = (
  amountInCrypto: boolean,
  oneDirectionRate: number | undefined
) => {
  if (!oneDirectionRate) return 0;

  const format = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 5 });

  if (!amountInCrypto) {
    return format(oneDirectionRate);
  }

  return format(1 / oneDirectionRate);
};

const GatewayIndicator: React.FC<GatewayIndicatorProps> = (
  props: GatewayIndicatorProps
) => {
  const { t } = useTranslation();
  const [rate, setRate] = useState(
    determineRate(props.amountInCrypto, props.selectedGateway?.rate)
  );
  const [optionLeftStyle, setOptionLeftStyle] = useState<React.CSSProperties>(
    {}
  );
  const optionWrapperRef = useRef<HTMLDivElement>(null);

  const adjustOptionLefWidth = () => {
    if (optionWrapperRef.current) {
      setOptionLeftStyle({
        maxWidth: `calc(100% - ${optionWrapperRef.current.scrollWidth + 10}px)`,
      });
      return;
    }
    setOptionLeftStyle({});
  };

  useEffect(() => {
    setRate(determineRate(props.amountInCrypto, props.selectedGateway?.rate));
  }, [props.amountInCrypto, props.selectedGateway?.rate]);

  useEffect(() => {
    adjustOptionLefWidth();
    window.addEventListener("resize", adjustOptionLefWidth);
    return () => {
      window.removeEventListener("resize", adjustOptionLefWidth);
    };
  }, []);

  useEffect(() => {
    adjustOptionLefWidth();
  }, [props.selectedGateway]);

  if (props.isInitialLoading || !props.selectedGateway)
    return (
      <Skeleton optionLeftStyle={optionLeftStyle} ref={optionWrapperRef} />
    );

  if (props.isLoading) {
    return (
      <div className={styles.wrapper}>
        <Loader className={styles.loader} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper} onClick={props.openMoreOptions}>
      <div className={styles["option-wrapper"]} ref={optionWrapperRef}>
        <img
          className={styles["option-icon"]}
          src={props.selectedGateway.icon}
          alt="selected-icon"
        />
        <div className={styles["option-body"]}>
          <div className={`${styles["option-label"]}`}>
            {t("buyCryptoView.bestRate")}
          </div>
          <div className={styles["option-handle"]}>
            <span>{props.selectedGateway.name}</span>{" "}
            <img src={arrowDownIcon} />
          </div>
        </div>
      </div>
      <div className={styles["option-info"]} style={optionLeftStyle}>
        1 {props.unitCrypto} ≈ {rate}{" "}
        <span className={commonStyles["txt-no-wrap"]}>{props.unitFiat}</span>
        <br />
        {t("buyCryptoView.includeAllFees")}
      </div>
    </div>
  );
};
export default GatewayIndicator;
