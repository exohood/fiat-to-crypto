import React, { useContext } from "react";
import { APIContext } from "../../ApiContext";
import InfoBox from "../../common/InfoBox";
import stylesCommon from "../../styles.module.css";
import { NavContext } from "../../NavContext";
import { NotificationSectionProps } from "./NotificationSection.models";

const NotificationSection: React.FC<NotificationSectionProps> = (
  props: NotificationSectionProps
) => {
  const { triggerChat } = useContext(NavContext);

  const {
    collected: { errors },
  } = useContext(APIContext);

  const rateErrorType = errors?.RATE?.type;

  return (
    <>
      <InfoBox
        in={rateErrorType === "OTHER"}
        type="notification"
        className={`${stylesCommon.body__child}`}
      >
        {errors?.RATE?.message}
      </InfoBox>

      <InfoBox
        onActionClick={
          rateErrorType === "ALL_UNAVAILABLE"
            ? props.onBuyCrypto
            : rateErrorType === "NO_RATES"
            ? triggerChat
            : undefined
        }
        actionText={
          rateErrorType === "ALL_UNAVAILABLE"
            ? "See all gateways"
            : rateErrorType === "NO_RATES"
            ? "Contact us"
            : undefined
        }
        in={rateErrorType === "ALL_UNAVAILABLE" || rateErrorType === "NO_RATES"}
        type="notification"
        className={`${stylesCommon.body__child}`}
      >
        {errors?.RATE?.message}
      </InfoBox>
    </>
  );
};

export default NotificationSection;
