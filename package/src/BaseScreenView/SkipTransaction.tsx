import React, { useContext, useEffect, useState } from "react";
import { APIContext, GatewayRateOption } from "../ApiContext";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import ProgressHeader from "../common/Header/ProgressHeader/ProgressHeader";
import { NavContext } from "../NavContext";
import Step from "../steps/Step";
import BodyLoading from "../steps/WaitView/BodyLoading";
import { getBestGatewayByPerformance, getBestGatewayByPrice } from "../utils";
import styles from "../styles.module.css";
import Footer from "../common/Footer";
import ErrorView from "../common/ErrorView";
import { triggerLandingViewGtmFtcEvent } from "../helpers/useGTM";

const SkipTransaction: React.FC = () => {
  const {
    inputInterface,
    collected,
    apiInterface,
    data: {
      allRates,
      availablePaymentMethods,
      availableCryptos,
      availableCurrencies,
      isRateError,
      isRatesLoaded,
    },
  } = useContext(APIContext);
  const { handleInputChange } = inputInterface;
  const { onlyScreen } = useContext(NavContext);
  const { init } = apiInterface;
  const { transaction } = collected;
  const { txnGateway, txnPaymentMethod, txnFiat, txnCrypto, txnAmount } =
    transaction;
  const [initLoadingFinished, setInitLoadingFinished] = useState(false);

  useEffect(() => {
    init().finally(() => {
      setInitLoadingFinished(true);
    });
  }, [init]);

  useEffect(() => {
    return () => {
      handleInputChange("skipTransactionScreen", false);
    };
  }, [handleInputChange]);

  useEffect(() => {
    if (isRatesLoaded && isRateError) {
      const rate = allRates.find(
        (rate) => collected.selectedGateway?.name === rate.name
      );
      const message = rate?.error?.message ?? allRates[0].error?.message;
      message && onlyScreen(<ErrorView message={message} />);
    }
  }, [
    isRateError,
    allRates,
    onlyScreen,
    handleInputChange,
    isRatesLoaded,
    collected.selectedGateway?.name,
  ]);

  useEffect(() => {
    if (txnAmount === 0 || isNaN(txnAmount))
      onlyScreen(<ErrorView message="Transaction amount is not valid." />);

    // allRates.find((rate) => rate.error?.limit < txnAmount);
  }, [onlyScreen, txnAmount]);

  useEffect(() => {
    if (!txnCrypto)
      onlyScreen(<ErrorView message="Crypto currency not provided." />);
    else if (
      isRatesLoaded &&
      availableCryptos.findIndex((crypto) => txnCrypto === crypto.id) === -1
    )
      onlyScreen(
        <ErrorView message="Unable to find requested crypo currency." />
      );
  }, [isRatesLoaded, availableCryptos, onlyScreen, txnCrypto]);

  useEffect(() => {
    if (!txnFiat)
      onlyScreen(<ErrorView message="Fiat currency not provided." />);
    else if (
      isRatesLoaded &&
      availableCurrencies.findIndex((fiat) => txnFiat === fiat.id) === -1
    )
      onlyScreen(
        <ErrorView message="Unable to find requested fiat currency." />
      );
  }, [isRatesLoaded, availableCurrencies, onlyScreen, txnFiat]);

  useEffect(() => {
    if (
      initLoadingFinished &&
      isRatesLoaded &&
      availablePaymentMethods.findIndex(
        (paymentMethod) => txnPaymentMethod === paymentMethod.id
      ) === -1
    ) {
      onlyScreen(
        <ErrorView message="Unable to find requested payment method." />
      );
    }
  }, [
    isRatesLoaded,
    availablePaymentMethods,
    initLoadingFinished,
    onlyScreen,
    txnPaymentMethod,
  ]);

  useEffect(() => {
    if (isRatesLoaded) {
      let selectedGateway: GatewayRateOption | undefined | null;
      if (!txnGateway) {
        if (collected.selectGatewayBy === SelectGatewayByType.Performance) {
          selectedGateway = getBestGatewayByPerformance(
            allRates,
            collected.selectedCurrency?.name,
            collected.selectedCrypto?.name,
            collected.staticRouting
          );
          if (selectedGateway) {
            handleInputChange("selectedGateway", selectedGateway);
          } else {
            selectedGateway = getBestGatewayByPrice(
              allRates,
              !!collected.amountInCrypto
            );
            handleInputChange("selectedGateway", selectedGateway);
            handleInputChange("selectGatewayBy", SelectGatewayByType.Price);
          }
        }

        if (collected.selectGatewayBy === SelectGatewayByType.Price) {
          selectedGateway = getBestGatewayByPrice(
            allRates,
            !!collected.amountInCrypto
          );
          handleInputChange("selectedGateway", selectedGateway);
        }
      } else {
        selectedGateway = allRates.find((rate) => txnGateway === rate.name);
        if (!selectedGateway)
          onlyScreen(<ErrorView message="Unable to find requested onramp." />);
        handleInputChange("selectedGateway", selectedGateway);
      }
    }
  }, [
    collected.amountInCrypto,
    collected.selectGatewayBy,
    collected.selectedCrypto,
    collected.selectedCurrency,
    collected.staticRouting,
    allRates,
    txnGateway,
    handleInputChange,
    onlyScreen,
    isRatesLoaded,
  ]);

  useEffect(() => {
    if (collected.selectedGateway?.error) {
      onlyScreen(
        <ErrorView message={collected.selectedGateway?.error.message} />
      );
    }
    if (collected.selectedGateway?.nextStep) {
      triggerLandingViewGtmFtcEvent(collected);
      onlyScreen(
        <Step
          nextStep={collected.selectedGateway.nextStep}
          isConfirmed={true}
        />
      );
      handleInputChange("skipTransactionScreen", false);
    }
  }, [collected, collected.selectedGateway, handleInputChange, onlyScreen]);

  return (
    <div className={styles.view}>
      <ProgressHeader useBackButton />
      <BodyLoading error={""} />
      <Footer />
    </div>
  );
};

export default SkipTransaction;
