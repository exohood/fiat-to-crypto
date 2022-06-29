import React, { useContext } from "react";
import stylesCommon from "../../styles.module.css";
import styles from "./styles.module.css";

import { NavContext } from "../../NavContext";
import { NextStep } from "../../ApiContext";

import { ReactComponent as ERROR } from "../../icons/error.svg";
import Step from "../Step";
import BuyCryptoView from "../../BuyCryptoView";

type ActionableErrorViewType = {
  title?: string;
  message?: string;
  fatal?: boolean;
  step?: NextStep;
  parentStep?: NextStep;
  optionalUrl?: string;
};

const BodyActionableErrorView: React.FC<ActionableErrorViewType> = (props) => {

  const { replaceScreen, nextScreen } = useContext(NavContext);

  return (
    <main className={`${stylesCommon.body}`}>
      <div
        className={`${stylesCommon.body__child} ${stylesCommon.grow} ${styles.body}`}
      >

        <ERROR className={styles["fail-icon"]} />

        {!!props.title && (
          <span className={styles.title}>
            { props.title }
          </span>
        )}
        <span className={styles.info}>
          {props.message ? props.message : "Something has gone wrong. Please try again."}
        </span>


        {!!props.optionalUrl  && (
          <button
          onClick={ () => window.open(props.optionalUrl) }
          className={`${styles["button--basic"]} ${
            styles["button--instant"]
          }`}
        >
          { "Contact Coinify" }
        </button>
        )}

        {(!!props.step || props.fatal! === true) &&
          (<button
            onClick={
            (props.fatal === false) ?
              () => {
                    replaceScreen(
                      <Step
                        gtmToBeRegisterStep={props.parentStep}
                        nextStep={props.step as NextStep}
                      />
                    );
                  }
            : () => {
                nextScreen(<BuyCryptoView />);
              } }
            className={`${styles["button--basic"]} ${
              styles["button--instant"]
            }`}
          >
            { props.fatal === false ? "Try again" : "Try another gateway" }
          </button>
          )}
      </div>
    </main>
  );
};

BodyActionableErrorView.defaultProps = {};

export default BodyActionableErrorView;
