import React, { useContext, useState, useEffect } from "react";
import BodyForm from "./BodyFormView";
import styles from "../../styles.module.css";
import Step from "../Step";
/* import ErrorView from '../../common/ErrorView' */

import { APIContext, NextStep, NextStepError } from "../../ApiContext";
import { NavContext } from "../../NavContext";
import { areAllKeysFilled } from "../utils";

import { processError } from "../Step/utils";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import { StepType } from "../../ApiContext/api/types/nextStep";

const FormView: React.FC<{ nextStep: NextStep & { type: StepType.form } }> = ({
  nextStep,
}) => {
  const { nextScreen } = useContext(NavContext);
  const { inputInterface, collected, apiInterface } = useContext(APIContext);
  const [isFilled, setIsFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [errorObj, setErrorObj] = useState<{
    [key: string]: string | undefined;
  }>();
  const [title, setTitle] = useState(
    nextStep.title || (nextStep.humanName ?? "Purchase form")
  );
  const [useHeading] = useState(!!nextStep.useHeading);
  const [infoMsg, setInfoMsg] = useState(nextStep.hint ?? "");

  const { data: nextStepData = [] } = nextStep;

  useEffect(() => {
    if (nextStepData.length === 0) return;

    // set infoMsg if needed
    if (
      nextStepData.some((field) => field.name === "bankIban") &&
      nextStepData.length <= 2
    )
      setInfoMsg(
        "Please, fill in the bank account number that you will use to send the wire transfer."
      );

    if (nextStep.title) {
      return;
    }

    // set title
    if (
      nextStepData.some((field) => field.name === "email") &&
      nextStepData.some((field) => field.name === "password") &&
      nextStepData.length <= 2
    ) {
      setTitle("Input your email");
    } else if (
      nextStepData.some((field) => field.name === "phoneNumber") &&
      nextStepData.length <= 2
    ) {
      setTitle("Input phone number");
    } else if (
      nextStepData.some((field) => field.name === "verifyEmailCode") &&
      nextStepData.length <= 2
    ) {
      setTitle("Verify your email");
    } else if (
      nextStepData[0].name === "verifyPhoneCode" ||
      nextStepData[0].name === "verifyCreditCard"
    ) {
      if (
        nextStepData.length === 2 &&
        (nextStepData[1].name === "verifyPhoneCode" ||
          nextStepData[1].name === "verifyCreditCard")
      )
        setTitle("Enter verification codes");
      else if (nextStepData.length === 1) setTitle("Enter verification code");
    }
    /* else if (
      (nextStepData.some(field => field.name === 'state') || nextStepData.length === 1)
      || (
        nextStepData.some(field => field.name === 'firstName')
        && nextStepData.some(field => field.name === 'country')
        && !nextStepData.some(field => field.name === 'ccNumber')
      )
    ) {
      setTitle('Your personal information')
    } */
  }, [nextStep.title, nextStepData]);

  const handleButtonAction = async () => {
    setIsLoading(true);
    setErrorObj(undefined);
    setErrorMsg(undefined);

    const params = nextStepData.reduce((acc, current) => {
      let value = collected[current.name];
      if (current.name === "cryptocurrencyAddress")
        value = collected[current.name]?.address;
      if (current.name === "cryptocurrencyAddressTag")
        value = collected["cryptocurrencyAddress"]?.memo;
      return { ...acc, [current.name]: value };
    }, {});
    try {
      const payload = { ...params, partnerContext: collected.partnerContext };
      const newNextStep = await apiInterface.executeStep(nextStep, payload);
      inputInterface.handleInputChange("isPartnerContextSent", true);
      nextScreen(
        <Step gtmToBeRegisterStep={nextStep} nextStep={newNextStep} />
      );
    } catch (_error) {
      const error = _error as NextStepError;
      const processedError = processError(error, nextStepData);
      if (error.fatal) {
        //nextScreen(<ErrorView type="TX" message={error.message} />)
        setErrorObj({ FATAL: error.message });
      } else if (processedError.field)
        setErrorObj({ [processedError.field]: processedError.message });
      else if (processedError.fields)
        setErrorObj(
          processedError.fields.reduce((acc, actual) => {
            return { ...acc, [actual.field]: actual.message };
          }, {})
        );
      else setErrorMsg(processedError.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const keysList = nextStepData
      .filter((data) => {
        if (
          data.type === "boolean" &&
          data.name === "areFundsFromLegalSources" &&
          data.required === true
        )
          return true;
        if (data.type === "boolean" && data.name !== "termsOfUse") return false;
        if (data.type !== "boolean" && data.required === false) return false;
        return true;
      })
      .map((nsd) => nsd.name);
    const filled = areAllKeysFilled(collected, keysList);
    setIsFilled(filled);
  }, [collected, nextStepData]);

  return (
    <div className={styles.view}>
      <ProgressHeader
        percentage={nextStep.progress}
        title={!useHeading ? title : undefined}
        useBackButton
      />
      <BodyForm
        fields={nextStepData}
        onActionButton={handleButtonAction}
        handleInputChange={inputInterface.handleInputChange}
        isLoading={isLoading}
        errorMsg={errorMsg}
        infoMsg={infoMsg}
        isFilled={isFilled}
        onErrorDismissClick={(field?: string) => {
          if (field && errorObj)
            setErrorObj((old) => ({ ...old, [field]: undefined }));
          else setErrorMsg(undefined);
        }}
        errorObj={errorObj}
        heading={useHeading ? title : undefined}
      />
    </div>
  );
};

export default FormView;
