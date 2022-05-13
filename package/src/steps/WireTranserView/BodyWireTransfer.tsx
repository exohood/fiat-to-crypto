import React, { useState } from "react";
import stylesCommon from "../../styles.module.css";

import InputDelegator from "../../common/Input/InputDelegator";
import ButtonAction from "../../common/ButtonAction";
import InfoBox from "../../common/InfoBox";

import IconCopy from "../../icons/copy.svg";

import { InfoDepositBankAccount } from "../../ApiContext";
import Footer from "../../common/Footer";

type BodyWireTransferType = {
  onActionButton?: () => void;
  onIconClick?: (id: string) => void;
  amount: string;
  symbol: string;
  bankDetails: InfoDepositBankAccount;
  textInfo?: string;
  reference: string;
};

const BodyWireTransfer: React.FC<BodyWireTransferType> = (props) => {
  const { amount, symbol, textInfo, bankDetails } = props;
  const { onActionButton, onIconClick } = props;

  const [copiedText, setCopiedText] = useState<string>();

  const onClick = (id: string, value: string, humanName: string) => {
    if (onIconClick) {
      onIconClick(value);
      setCopiedText(`${humanName} copied to clipboard.`);
    }
  };

  return (
    <main className={stylesCommon.body}>
      <InfoBox className={`${stylesCommon.body__child}`} in={!!textInfo}>
        {textInfo}
      </InfoBox>
      <InfoBox
        type="notification"
        className={`${stylesCommon.body__child}`}
        in={!!copiedText}
        canBeDismissed
        onDismissClick={() => setCopiedText(undefined)}
      >
        {copiedText}
      </InfoBox>
      <div
        className={`${stylesCommon.body__child} ${stylesCommon["row-fields"]}`}
      >
        <InputDelegator
          symbol={symbol}
          symbolPosition={"start"}
          value={amount}
          name="amount"
          className={stylesCommon["row-fields__child"]}
          label="Amount"
          disabled
          icon={IconCopy}
          iconPosition="end"
          onIconClick={onClick}
        />
        <InputDelegator
          value={props.reference}
          name="reference"
          className={stylesCommon["row-fields__child"]}
          label="Reference"
          disabled
          icon={IconCopy}
          iconPosition="end"
          onIconClick={onClick}
        />
      </div>
      <InputDelegator
        value={bankDetails?.iban}
        name="iban"
        className={stylesCommon.body__child}
        label="IBAN"
        disabled
        icon={IconCopy}
        iconPosition="end"
        onIconClick={onClick}
      />
      <InputDelegator
        value={bankDetails?.bankName}
        name="bankName"
        className={stylesCommon.body__child}
        label="Bank name"
        disabled
        icon={IconCopy}
        iconPosition="end"
        onIconClick={onClick}
      />
      <div
        className={`${stylesCommon.body__child} ${stylesCommon["row-fields"]}`}
      >
        <InputDelegator
          value={bankDetails?.bic}
          name="bic"
          className={stylesCommon["row-fields__child"]}
          label="BIC / SWIFT"
          disabled
          icon={IconCopy}
          iconPosition="end"
          onIconClick={onClick}
        />
        <InputDelegator
          value={bankDetails?.accountName}
          name="accountName"
          className={stylesCommon["row-fields__child"]}
          label="Account name"
          disabled
          icon={IconCopy}
          iconPosition="end"
          onIconClick={onClick}
        />
      </div>
      <InputDelegator
        value={bankDetails?.accountAddress}
        name="accountAddress"
        className={stylesCommon.body__child}
        label="Account address"
        disabled
        icon={IconCopy}
        iconPosition="end"
        onIconClick={onClick}
      />
      <InputDelegator
        value={bankDetails?.bankAddress}
        name="bankAddress"
        className={stylesCommon.body__child}
        label="Bank address"
        disabled
        icon={IconCopy}
        iconPosition="end"
        onIconClick={onClick}
      />

      <div
        className={`${stylesCommon.body__child} ${stylesCommon["grow-col"]}`}
      >
        {onActionButton && (
          <ButtonAction onClick={onActionButton} text="Finish" />
        )}
        <Footer />
      </div>
    </main>
  );
};

export default BodyWireTransfer;
