import React, { useCallback, useContext } from "react";
import ProgressHeader from "../../common/Header/ProgressHeader/ProgressHeader";
import BodyWireTransfer from "./BodyWireTransfer";
import SuccessView from "../SuccessView";
import { APIContext, NextStep } from "../../ApiContext";
import { copyToClipBoard } from "./utils";
import { NavContext } from "../../NavContext";

import styles from "../../styles.module.css";
import { StepType } from "../../ApiContext/api/types/nextStep";

const WireTransferView: React.FC<{
  nextStep: NextStep & { type: StepType.requestBankTransaction };
}> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const { collected } = useContext(APIContext);

  const handleIconClick = useCallback((value: string) => {
    copyToClipBoard(value, () => null);
  }, []);

  return (
    <div className={styles.view}>
      <ProgressHeader title="Wire transfer details" />
      <BodyWireTransfer
        onActionButton={() =>
          nextScreen(
            <SuccessView txType="pending" nextStep={{ type: StepType.completed }} />
          )
        }
        amount={collected.amount.toString()}
        bankDetails={nextStep.depositBankAccount}
        symbol={collected.selectedCurrency?.symbol ?? ""}
        textInfo={nextStep.hint}
        onIconClick={handleIconClick}
        reference={nextStep.reference ?? "No reference"}
      />
    </div>
  );
};

export default WireTransferView;
