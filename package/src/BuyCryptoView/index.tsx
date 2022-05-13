import React, { useContext, useEffect, useState } from "react";
import BodyBuyCrypto from "./BodyBuyCrypto";
import styles from "../styles.module.css";
import ChooseGatewayView from "../ChooseGatewayView/ChooseGatewayView";
import ErrorView from "../common/ErrorView";
import Step from "../steps/Step";
import { NavContext } from "../NavContext";
import { APIContext, NextStep } from "../ApiContext";
import * as API from "../ApiContext/api";
import TabsHeader from "../common/Header/TabsHeader/TabsHeader";
import { tabNames } from "./constants";

const BuyCryptoView: React.FC = () => {
  const [isFilled, setIsFilled] = useState(false);
  const [buyStep, setBuyStep] = useState<NextStep>();

  const { nextScreen } = useContext(NavContext);
  const { data, inputInterface, collected, apiInterface } =
    useContext(APIContext);
  const [initLoadingFinished, setInitLoadingFinished] = useState(false);

  const { handlePaymentMethodChange } = data;
  const { init } = apiInterface;
  const { errors } = collected;

  //flagEffectInit used to call init again
  useEffect(() => {
    init().finally(() => {
      setInitLoadingFinished(true);
    });
  }, [init]);

  //listening to errors sent by APIContext
  useEffect(() => {
    if (!errors || Object.keys(errors).length <= 0) return;
    const key = Object.keys(errors)[0] as keyof typeof errors;
    const type = errors?.[key]?.type;
    if (type && !["MIN", "MAX", "ALL_UNAVAILABLE", "NO_RATES"].includes(type))
      nextScreen(<ErrorView type={type} message={errors?.[key]?.message} />);
  }, [errors, nextScreen]);

  useEffect(() => {
    if (
      collected.selectedCrypto &&
      collected.selectedCurrency &&
      collected.selectedPaymentMethod &&
      collected.amount > 0
    )
      setIsFilled(true);
    else setIsFilled(false);
  }, [
    setIsFilled,
    collected.selectedCrypto,
    collected.selectedCurrency,
    collected.selectedPaymentMethod,
    collected.amount,
  ]);

  useEffect(() => {
    (async () => {
      try {
        const nextStep = await API.sell("BTC", 0.1, "blockchain", {
          amountInCrypto: true,
          country: collected.selectedCountry,
        });
        setBuyStep(nextStep.nextStep);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [collected.selectedCountry]);

  return (
    <div className={styles.view}>
      <TabsHeader
        tabs={
          buyStep && collected.supportSell
            ? tabNames
            : tabNames.filter((s, i) => i !== 1)
        }
        tabSelected={0}
        onClickItem={(i: number) => {
          if (i === 0) return;
          nextScreen(<Step nextStep={buyStep} />);
        }}
      />
      <BodyBuyCrypto
        onBuyCrypto={() => nextScreen(<ChooseGatewayView />)}
        selectedCrypto={collected.selectedCrypto}
        selectedCurrency={collected.selectedCurrency}
        selectedPaymentMethod={collected.selectedPaymentMethod}
        handleInputChange={inputInterface.handleInputChange}
        isFilled={isFilled}
        handlePaymentMethodChange={handlePaymentMethodChange}
        initLoadingFinished={initLoadingFinished}
      />
    </div>
  );
};

export default BuyCryptoView;
