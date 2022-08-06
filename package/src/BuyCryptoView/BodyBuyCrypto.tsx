import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import type { ItemType } from "../ApiContext";
import { APIContext, GatewayRateOption } from "../ApiContext";
import { SelectGatewayByType } from "../ApiContext/api/types/gateways";
import { StepType } from "../ApiContext/api/types/nextStep";
import ButtonAction from "../common/ButtonAction";
import Footer from "../common/Footer";
import InfoBox from "../common/InfoBox";
import OverlayPicker from "../common/OverlayPicker/OverlayPicker";
import { GtmEvent, GtmEventCategory, GtmEventLabel } from "../enums";
import { triggerLandingViewGtmFtcEvent } from "../helpers/useGTM";
import { useCashAppVenmoExperiment } from "../hooks/ab-test-experiments/useCashAppVenmoExperiment";
import { useGTMDispatch } from "../hooks/gtm";
import {
  buyBtnClickGtmEvent,
  genPaymentMethodSelectEvent,
} from "../hooks/gtm/buyCryptoViewEvents";
import { cashAppIcon } from "../icons/payment-methods/cashApp";
import { venmoIcon } from "../icons/payment-methods/venmo";
import { NavContext } from "../NavContext";
import stylesCommon from "../styles.module.css";
import { getBestGatewayByPerformance, getBestGatewayByPrice } from "../utils";
import errorTypes from "./../ApiContext/api/errorTypes";
import Step from "./../steps/Step";
import { IBodyBuyCryptoProps } from "./BuyCryptoView.models";
import { LoadingItem } from "./constants";
import GatewayIndicator from "./GatewayIndicator/GatewayIndicator";
import { IGatewaySelected } from "./GatewayIndicator/GatewayIndicator.models";
import { useGatewaySelection } from "./hooks";
import NotificationSection from "./NotificationSection/NotificationSection";
import PaymentMethodPicker from "./PaymentMethodPicker/PaymentMethodPicker";
import TopScreenA from "./ScreenA/TopScreenA";
import TopScreenB2 from "./TopScreenB2/TopScreenB2";

const venmoPaymentMethod: ItemType = {
  id: "venmo",
  name: "Venmo",
  symbol: "",
  info: "",
  icon: venmoIcon,
};

const cashAppPaymentMethod: ItemType = {
  id: "cashApp",
  name: "Cash app",
  symbol: "",
  info: "",
  icon: cashAppIcon,
};

function mapGatewaySelectedToPicker(
  selectedGateway?: GatewayRateOption
): IGatewaySelected | undefined {
  if (!selectedGateway) {
    return;
  }
  return {
    name: selectedGateway.name,
    icon: selectedGateway.icon || "",
    rate: selectedGateway.rate,
  };
}

const BodyBuyCrypto: React.FC<IBodyBuyCryptoProps> = (props) => {
  const { t } = useTranslation();
  const {
    onBuyCrypto,
    handleInputChange,
    selectedCrypto = LoadingItem,
    selectedPaymentMethod = LoadingItem,
    isFilled = true,
  } = props;
  const {
    collected,
    data: { availablePaymentMethods, allRates, handlePaymentMethodChange },
  } = useContext(APIContext);
  const { nextScreen, backScreen } = useContext(NavContext);
  const [paymentMethods, setPaymentMethods] = useState<ItemType[]>([]);
  const [hasMinMaxErrorsMsg, setHasMinMaxErrorsMsg] = useState<boolean>();
  const [isGatewayInitialLoading, setIsGatewayInitialLoading] =
    useState<boolean>(true);
  const [showScreenA, setShowScreenA] = useState(false);
  const sendDataToGTM = useGTMDispatch();
  const { gatewaySelectionTxt } = useGatewaySelection();
  const variant = useCashAppVenmoExperiment();
  const [showExperimentInfo, setShowExperimentInfo] = useState(false);

  useEffect(() => {
    const errType = collected.errors?.RATE?.type;
    setHasMinMaxErrorsMsg(
      [errorTypes.MIN, errorTypes.MAX].some((i) => i === errType) &&
        !!collected.errors?.RATE?.message
    );
  }, [collected.errors]);

  useEffect(() => {
    //This will be removed once the Venmo/Cashapp experiment completed.
    if (collected.selectedCountry === "us") {
      if (variant === "Control") {
        setPaymentMethods(availablePaymentMethods);
      } else {
        const _paymentMethods: ItemType[] = [...availablePaymentMethods];
        let paymentMethod;
        if (variant === "Venmo") paymentMethod = venmoPaymentMethod;
        else if (variant === "CashApp") paymentMethod = cashAppPaymentMethod;
        paymentMethod && _paymentMethods.splice(1, 0, paymentMethod);
        setPaymentMethods(_paymentMethods);
      }
    } else {
      setPaymentMethods(availablePaymentMethods);
    }
  }, [
    availablePaymentMethods,
    collected.selectedCountry,
    sendDataToGTM,
    variant,
  ]);

  useEffect(() => {
    if (variant) {
      let category;
      switch (variant) {
        case "Control":
          category = GtmEventCategory.CONTROL;
          break;
        case "Venmo":
          category = GtmEventCategory.VENMO;
          break;
        case "CashApp":
          category = GtmEventCategory.CASH_APP;
          break;
        default:
          break;
      }
      sendDataToGTM({
        event: GtmEvent.EXPERIMENT,
        category,
        label: GtmEventLabel.PAYMENT_METHOD_FAKE_DOOR_EXPERIMENT,
      });
    }
  }, [sendDataToGTM, variant]);

  const isNextStepConfirmed = useCallback(() => {
    if (!collected.selectedGateway) return false;

    const nextStep = collected.selectedGateway?.nextStep;
    if (!nextStep) return false;

    return (
      collected.selectedGateway.identifier === "Wyre" &&
      nextStep.type === StepType.form &&
      nextStep.data.some((field) => field.name === "ccNumber")
    );
  }, [collected.selectedGateway]);

  const onNextStep = useCallback(() => {
    sendDataToGTM(buyBtnClickGtmEvent);
    if (!collected.selectedGateway) {
      return;
    }

    triggerLandingViewGtmFtcEvent(collected);
    nextScreen(
      <Step
        nextStep={collected.selectedGateway.nextStep}
        isConfirmed={!isNextStepConfirmed()}
      />
    );
  }, [collected, isNextStepConfirmed, nextScreen, sendDataToGTM]);

  const openMorePaymentOptions = useCallback(() => {
    if (paymentMethods.length > 1) {
      nextScreen(
        <OverlayPicker
          name="paymentMethod"
          title="Select payment method"
          indexSelected={paymentMethods.findIndex(
            (m) => m.id === collected.selectedPaymentMethod?.id
          )}
          items={paymentMethods}
          onItemClick={(name: string, index: number, item: ItemType) => {
            if (item.name === "Venmo" || item.name === "Cash app") {
              setShowExperimentInfo(true);
            } else {
              setShowExperimentInfo(false);
              handlePaymentMethodChange(item);
            }
            sendDataToGTM(genPaymentMethodSelectEvent(item.id));
            backScreen();
          }}
        />
      );
    }
  }, [
    nextScreen,
    paymentMethods,
    collected.selectedPaymentMethod?.id,
    handlePaymentMethodChange,
    sendDataToGTM,
    backScreen,
  ]);

  useEffect(() => {
    if (collected.selectGatewayBy === SelectGatewayByType.Performance) {
      const gatewayByPerformance = getBestGatewayByPerformance(
        allRates,
        collected.selectedCurrency?.name,
        collected.selectedCrypto?.name,
        collected.staticRouting
      );
      if (gatewayByPerformance) {
        handleInputChange("selectedGateway", gatewayByPerformance);
        return;
      }
    }
    if (collected.selectGatewayBy === SelectGatewayByType.Price) {
      const gatewayByPrice = getBestGatewayByPrice(
        allRates,
        !!collected.amountInCrypto
      );
      handleInputChange("selectedGateway", gatewayByPrice);
    }
  }, [
    allRates,
    collected.amountInCrypto,
    collected.selectGatewayBy,
    collected.selectedCrypto,
    collected.selectedCurrency,
    collected.selectedPaymentMethod,
    handleInputChange,
    collected.staticRouting,
  ]);

  useEffect(() => {
    if (isGatewayInitialLoading) {
      setIsGatewayInitialLoading(
        !props.initLoadingFinished || collected.isCalculatingAmount
      );
    }
  }, [
    props.initLoadingFinished,
    collected.isCalculatingAmount,
    isGatewayInitialLoading,
  ]);

  useLayoutEffect(() => {
    setShowScreenA(
      new URLSearchParams(window.location.search).get("showScreenA") === "1"
    );
  }, []);

  const handlePaymentChange = (item: ItemType) => {
    if (item.name === "Venmo" || item.name === "Cash app") {
      setShowExperimentInfo(true);
    } else {
      setShowExperimentInfo(false);
      handlePaymentMethodChange(item);
    }
  };

  return (
    <main className={stylesCommon.body}>
      <NotificationSection onBuyCrypto={onBuyCrypto} />

      {showScreenA && <TopScreenA />}
      {!showScreenA && <TopScreenB2 />}

      <PaymentMethodPicker
        openMoreOptions={openMorePaymentOptions}
        selectedId={selectedPaymentMethod.id}
        items={paymentMethods}
        onChange={handlePaymentChange}
        isLoading={!props.initLoadingFinished || paymentMethods.length === 0}
      />
      {showExperimentInfo && (
        <InfoBox
          in={true}
          type="info"
          canBeDismissed={true}
          className={`${stylesCommon.body__child}`}
        >
          Unfortunately {variant} is currently not available.
        </InfoBox>
      )}

      {(!!collected.selectedGateway || isGatewayInitialLoading) &&
        collected.errors?.RATE?.type !== errorTypes.NO_RATES && (
          <GatewayIndicator
            selectedGateway={mapGatewaySelectedToPicker(
              collected.selectedGateway
            )}
            gatewaySelectionTxt={gatewaySelectionTxt}
            unitCrypto={collected.selectedCrypto?.name}
            unitFiat={collected.selectedCurrency?.name}
            openMoreOptions={onBuyCrypto}
            isLoading={collected.isCalculatingAmount}
            isInitialLoading={isGatewayInitialLoading}
            amountInCrypto={!!collected.amountInCrypto}
          />
        )}

      <div className={`${stylesCommon["body__child-grow"]}`}>
        <ButtonAction
          onClick={onNextStep}
          text={`${t("buyCryptoView.buy")} ${selectedCrypto.name}`}
          disabled={
            !isFilled ||
            collected.isCalculatingAmount ||
            hasMinMaxErrorsMsg ||
            [errorTypes.ALL_UNAVAILABLE, errorTypes.NO_RATES].indexOf(
              collected.errors?.RATE?.type || ""
            ) > -1
          }
        />
      </div>
      <Footer />
    </main>
  );
};

export default BodyBuyCrypto;
