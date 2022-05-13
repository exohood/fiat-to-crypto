import React, { useContext, useEffect, useState } from "react";
import BodyLoading from "./BodyLoading";
import styles from "../../styles.module.css";

import { NavContext } from "../../NavContext";
import { APIContext } from "../../ApiContext";
import { delay } from "../utils";
import { NextStep } from "../../ApiContext/api/types/nextStep";
import Step from "../Step";
import ErrorView from "../../common/ErrorView";
import Footer from "../../common/Footer";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";

const LoadingView: React.FC<{ nextStep: NextStep & { type: "wait" } }> = (
  props
) => {
  const { nextScreen, backScreen, replaceScreen } = useContext(NavContext);
  const { apiInterface, inputInterface, collected } = useContext(APIContext);
  const { executeStep } = apiInterface;
  const [error, setError] = useState("");
  const { handleInputChange } = inputInterface;
  const { nextStep } = props;
  const [collectedStore] = useState(collected);

  useEffect(() => {
    const callback = async () => {
      let newNextStep: NextStep = nextStep;
      let failed = false;
      while (newNextStep.type === "wait" && !failed) {
        try {
          await delay(500);
          let payload = { partnerContext: collectedStore.partnerContext };
          if (newNextStep.extraData && newNextStep.extraData.length > 0) {
            newNextStep.extraData.forEach((data) => {
              let value = collectedStore[data.name];
              if (data.name === "cryptocurrencyAddress")
                value = collectedStore[data.name]?.address;
              else if (data.name === "cryptocurrencyAddressTag")
                value = collectedStore["cryptocurrencyAddress"]?.memo;
              else value = collectedStore[data.name];
              payload = {
                ...payload,
                [data.name]: value,
              };
            });
          }
          newNextStep = await executeStep(newNextStep, payload);
          handleInputChange("isPartnerContextSent", true);
        } catch (error) {
          failed = true;
          if (error.fatal) nextScreen(<ErrorView message={error.message} />);
          else
            setError(
              error.message ??
                "Couldn't process your information, please, try again."
            );
          break;
        }
      }
      if (!failed) replaceScreen(<Step nextStep={newNextStep} />);
    };
    callback();
  }, [
    handleInputChange,
    collected.partnerContext,
    executeStep,
    nextStep,
    backScreen,
    nextScreen,
    replaceScreen,
    collectedStore,
  ]);

  return (
    <div className={styles.view}>
      <ProgressHeader percentage={props.nextStep.progress} useBackButton />
      <BodyLoading
        error={error}
        title={props.nextStep.title}
        message={props.nextStep.message}
      />
      <Footer />
    </div>
  );
};

export default LoadingView;
