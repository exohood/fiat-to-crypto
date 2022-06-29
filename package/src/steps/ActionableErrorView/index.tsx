import React from "react";
import { NextStep } from "../../ApiContext";
import BodyActionableErrorView from "./BodyActionableErrorView";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";

import styles from "../../styles.module.css";
import { StepType } from "../../ApiContext/api/types/nextStep";

type ActionableErrorProps = {
  nextStep: Partial<NextStep> & { type: StepType.actionableError };
};

const ActionableErrorView: React.FC<ActionableErrorProps> = (props) => {
  return (
    <div className={styles.view}>
      <ProgressHeader title={props.nextStep.humanName ?? ""} />
      <BodyActionableErrorView
        title={props.nextStep.title}
        message={props.nextStep.message}
        fatal={props.nextStep.fatal}
        step={props.nextStep.nextStep}
        parentStep={props.nextStep as NextStep}
        optionalUrl={props.nextStep.optionalUrl}
      />
    </div>
  );
};

export default ActionableErrorView;
