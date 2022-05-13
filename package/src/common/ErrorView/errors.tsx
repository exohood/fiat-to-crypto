import React from "react";
import { ReactComponent as ErrorIllustration } from "../../icons/error.svg";
import countryNames from "../../ApiContext/utils/contryNames";
import styles from "./styles.module.css";
import ButtonAction from "../ButtonAction";

export const COUNTRY_NOT_SUPPORTED = (country?: string): JSX.Element => {
  const _country =
    countryNames[country?.toUpperCase() ?? ""] ?? country?.toUpperCase();
  return (
    <>
      <ErrorIllustration className={styles["content-image"]} />
      <span className={styles["content-title"]}>Country not supported</span>
      <span className={styles["content-description"]}>
        {_country} is not yet supported by Onramper.
        <br />
        We&apos;re working hard to make it available for you as soon as
        possible!
        <br />
        <br />
        For more information read our FAQs or contact us.
      </span>
      <div className={styles["content-description"]}>
        <a
          className={styles["content-link"]}
          target="_blank"
          rel="noreferrer"
          href="https://onramper.com/FAQ/"
        >
          Read our FAQs
        </a>
      </div>
    </>
  );
};

export const DISABLED_GATEWAYS = (
  <>
    <ErrorIllustration className={styles["content-image"]} />
    <span className={styles["content-title"]}>It&apos;s not you...</span>
    <span className={styles["content-description"]}>
      Looks like this Onramper integration has disabled some of the available
      gateways in this area.
      <br />
      For more information read our FAQs or contact us.
      <br />
      <br />
    </span>
    <div className={styles["content-description"]}>
      <a
        className={styles["content-link"]}
        target="_blank"
        rel="noreferrer"
        href="https://onramper.com/FAQ/"
      >
        Read our FAQs
      </a>
    </div>
  </>
);

export const API_ERROR = (message: string, cb: () => any): JSX.Element => {
  return (
    <>
      <ErrorIllustration className={styles["content-image"]} />
      <span className={styles["content-title"]}>Couldn&apos;t continue</span>
      <span className={styles["content-description"]}>
        {message ? (
          <span className={styles["content-message"]}>
            {message}
            <br />
          </span>
        ) : (
          <br />
        )}
        For more information of the error, read our FAQs or contact us.
      </span>
      <div className={styles["content-description"]}>
        <ButtonAction
          className={styles["content-button"]}
          text="Try again"
          size="small"
          onClick={cb}
        />
        <a
          className={styles["content-link"]}
          target="_blank"
          rel="noreferrer"
          href="https://onramper.com/FAQ/"
        >
          Read our FAQs
        </a>
      </div>
    </>
  );
};

export const CRASH_ERROR = (cb: () => any): JSX.Element => {
  return (
    <>
      <ErrorIllustration className={styles["content-image"]} />
      <span className={styles["content-title"]}>
        It&apos;s not about you...
      </span>
      <span className={styles["content-description"]}>
        Something went really wrong. Please, restart the widget.
      </span>
      <div className={styles["content-description"]}>
        <ButtonAction
          className={styles["content-button"]}
          text="Restart"
          size="small"
          onClick={cb}
        />
        <a
          className={styles["content-link"]}
          target="_blank"
          rel="noreferrer"
          href="https://onramper.com/FAQ/"
        >
          Read our FAQs
        </a>
      </div>
    </>
  );
};

export const NO_ITEMS_FOUND = (message?: string): JSX.Element => {
  return (
    <>
      <ErrorIllustration className={styles["content-image"]} />
      <span className={styles["content-title"]}>We tried but...</span>
      <span className={styles["content-description"]}>
        looks like this Onramper integration has disabled some items.
        {message ? (
          <span className={styles["content-message"]}>
            {message}
            <br />
          </span>
        ) : (
          <br />
        )}
        For more information read our FAQs or contact us.
      </span>
      <div className={styles["content-description"]}>
        <a
          className={styles["content-link"]}
          target="_blank"
          rel="noreferrer"
          href="https://onramper.com/FAQ/"
        >
          Read our FAQs
        </a>
      </div>
    </>
  );
};
