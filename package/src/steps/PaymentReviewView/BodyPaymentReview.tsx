import React, { useEffect, useState } from "react";
import stylesCommon from "../../styles.module.css";
import classes from "./PaymentReview.module.css";

import ButtonAction from "../../common/ButtonAction";
import Footer from "../../common/Footer";
import Heading from "../../common/Heading/Heading";
import InfoBox from "../../common/InfoBox";
import StepsOverview from "../../common/StepsOverview/StepsOverview";
import { BodyConfirmPaymentViewType } from "./PaymentReview.models";

const BodyConfirmPaymentView: React.FC<BodyConfirmPaymentViewType> = (
  props
) => {
  const [errorControlMsg, setErrorControlMsg] = useState<string>();
  useEffect(() => {
    setErrorControlMsg(props.errorMessage);
  }, [props.errorMessage]);

  return (
    <main className={stylesCommon.body}>
      <InfoBox
        type="error"
        in={!!errorControlMsg}
        className={`${stylesCommon.body__child}`}
        canBeDismissed
        onDismissClick={() => setErrorControlMsg(undefined)}
      >
        {errorControlMsg}
      </InfoBox>

      {(props.heading || props.subHeading) && (
        <Heading text={props.heading} textSubHeading={props.subHeading} />
      )}

      {props.overviewSteps.map((item, index) => (
        <StepsOverview
          key={index}
          className={stylesCommon["shrink-0"]}
          items={item.items}
        />
      ))}

      <div
        className={`${stylesCommon.body__child} ${stylesCommon["grow-col"]} ${classes["button-wrapper"]}`}
      >
        <ButtonAction
          onClick={props.onActionButton}
          text={props.isLoading ? "Loading..." : "Continue"}
          disabled={!!props.isLoading}
        />
        <Footer />
      </div>
    </main>
  );
};

BodyConfirmPaymentView.defaultProps = {};

export default BodyConfirmPaymentView;
