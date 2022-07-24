import React, { useContext, useEffect, useState } from "react";
import stylesCommon from "../../styles.module.css";

import ErrorVisual from "../../common/ErrorVisual";
import { NavContext } from "../../NavContext";

import { APIContext, NextStep } from "../../ApiContext";
import Footer from "../../common/Footer";
import PaymentReviewDecorator from "../PaymentReviewView/PaymentReviewDecorator";
import { useStepGtmCall } from "./hooks";
import useStepResolutionCall from "./useStepResolutionCall";
import { StepType } from "../../ApiContext/api/types/nextStep";

export interface NewStepProps {
  nextStep?: NextStep;
  gtmToBeRegisterStep?: NextStep;
  isConfirmed?: boolean;
}
const StepViewContent: React.FC<NewStepProps> = ({
  nextStep,
  gtmToBeRegisterStep,
  isConfirmed,
}) => {
  const { replaceScreen } = useContext(NavContext);
  const { inputInterface, collected } = useContext(APIContext);
  const [isProcessingStep, setIsProcessingStep] = useState(true);
  const registerStepGtmEvent = useStepGtmCall(gtmToBeRegisterStep);
  const getMatchedStepCallback = useStepResolutionCall(nextStep);

  useEffect(() => {
    if (!getMatchedStepCallback || !registerStepGtmEvent) {
      return;
    }

    if (!nextStep) {
      setIsProcessingStep(false);
      return;
    }

    const { selectedCrypto, defaultAddrs, isAddressEditable } = collected;

    const showReviewAsFrontendStepIfApplicable = () => {
      if (
        isConfirmed === false ||
        (!isConfirmed &&
          (nextStep.type === StepType.iframe ||
            nextStep.type === StepType.requestBankTransaction) &&
          nextStep.type === StepType.iframe &&
          !nextStep.fullscreen)
      ) {
        let includeAddr = true;
        if (
          nextStep.type !== StepType.iframe &&
          nextStep.type !== StepType.requestBankTransaction
        ) {
          includeAddr = false;
          if (!isAddressEditable)
            inputInterface.handleInputChange(
              "cryptocurrencyAddress",
              defaultAddrs[selectedCrypto?.id ?? ""]
            );
        }

        registerStepGtmEvent();
        replaceScreen(
          <PaymentReviewDecorator
            nextStep={nextStep}
            includeCryptoAddr={includeAddr}
          />
        );
        return true;
      }
      return false;
    };

    if (showReviewAsFrontendStepIfApplicable()) {
      return;
    }

    const stepCallback = getMatchedStepCallback();
    if (stepCallback) {
      registerStepGtmEvent();
      stepCallback();
      return;
    }
    setIsProcessingStep(false);
  }, [
    nextStep,
    replaceScreen,
    isConfirmed,
    inputInterface,
    collected,
    registerStepGtmEvent,
    getMatchedStepCallback,
  ]);

  return (
    <main className={stylesCommon.body}>
      {!isProcessingStep && (
        <div className={`${stylesCommon.body__child} ${stylesCommon.grow}`}>
          <ErrorVisual message="An error occurred while trying to connect to server. Please try again later." />
        </div>
      )}
      <Footer />
    </main>
  );
};

export default StepViewContent;
