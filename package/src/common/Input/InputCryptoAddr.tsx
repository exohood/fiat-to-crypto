import React, { useContext, useEffect, useCallback } from "react";

import IconMetamask from "../../icons/metamask.png";
import IconImToken from "../../icons/imtoken.png";

import {
  ProviderManager,
  ProviderNames,
} from "../../ApiContext/ProvidersManager";
import { APIContext } from "../../ApiContext";
import InputDelegator from "./InputDelegator";

type InputCryptoAddrType = {
  handleInputChange: (name: string, value: any) => void;
  error?: string;
  className: string;
  type?: string;
  hint?: string;
  onClick?: () => void;
  onHelpClick?: () => void;
  disabled?: boolean;
};

const InputCryptoAddr = React.forwardRef<HTMLDivElement, InputCryptoAddrType>(
  (props, ref) => {
    const { handleInputChange, error, type, disabled = false } = props;
    const { collected } = useContext(APIContext);

    const [newErr, setNewErr] = React.useState(error);
    const [newInfo, setNewInfo] = React.useState<string>();

    useEffect(() => {
      setNewErr(error);
    }, [error]);

    useEffect(() => {
      setNewInfo(undefined);
      setNewErr(undefined);
    }, [collected.cryptocurrencyAddress]);

    useEffect(() => {
      if (collected.cryptocurrencyAddress === undefined)
        handleInputChange(
          "cryptocurrencyAddress",
          collected.defaultAddrs[collected.selectedCrypto?.id ?? ""]
        );
    }, [
      collected.defaultAddrs,
      collected.selectedCrypto?.id,
      collected.cryptocurrencyAddress,
      handleInputChange,
    ]);

    const onChange = useCallback(
      (name: string, value: string) => {
        handleInputChange(name, {
          ...collected.cryptocurrencyAddress,
          address: value,
        });
      },
      [handleInputChange, collected.cryptocurrencyAddress]
    );
    
    const getWalletAddrs = useCallback(async () => {
      setNewInfo(undefined);
      const importedWallets = await ProviderManager.getAccounts();
      if (!importedWallets) {
        setNewInfo(
          `Couldn't get your ${
            collected.selectedCrypto?.id ?? ""
          } address from ${ProviderManager.providerName}, access denied.`
        );
        return;
      }
      handleInputChange("cryptocurrencyAddress", {
        address: importedWallets[collected.selectedCrypto?.id ?? ""],
      });
      setNewErr(undefined);
      setNewInfo(
        `${
          collected.selectedCrypto?.info ?? ""
        } address successfully imported from ${
          ProviderManager.providerName
        } wallet`
      );
    }, [
      collected.selectedCrypto?.id,
      handleInputChange,
      collected.selectedCrypto?.info,
    ]);

    useEffect(() => {
      if (!collected.selectedCrypto?.id) return;
      if (
        !ProviderManager.connect(
          collected.selectedCrypto.id,
          collected.selectedCrypto?.info ?? collected.selectedCrypto.id
        )
      )
        return;

      switch (ProviderManager.providerName) {
        case ProviderNames.Metamask:
      }
    }, [collected.selectedCrypto?.id, collected.selectedCrypto?.info]);

    return (
      <InputDelegator
        hintButton
        onHintClick={ProviderManager.providerName ? getWalletAddrs : undefined}
        /* symbol='Import address' */
        clickableIcon
        icon={
          collected.isAddressEditable
            ? getIconByWalletProvider(ProviderManager.providerName)
            : undefined
        }
        onIconClick={getWalletAddrs}
        onClick={props.onClick}
        ref={ref}
        hint={
          ProviderManager.providerName && collected.isAddressEditable
            ? `Import address from ${ProviderManager.providerName} wallet`
            : props.hint
        }
        type={type}
        error={newErr}
        value={collected.cryptocurrencyAddress?.address ?? ""}
        iconPosition="end"
        name="cryptocurrencyAddress"
        onChange={onChange}
        className={props.className}
        label={`Your ${collected.selectedCrypto?.name} wallet address`}
        disabled={
          disabled &&
          !!collected.defaultAddrs[collected.selectedCrypto?.id ?? ""]
        }
        info={newInfo}
        iconTitle={
          collected.isAddressEditable
            ? `Import address from ${ProviderManager.providerName}`
            : undefined
        }
        placeholder="e.g 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5"
      />
    );
  }
);

const getIconByWalletProvider = (providerName?: ProviderNames) => {
  if (!providerName) return "";
  switch (providerName) {
    case ProviderNames.Metamask:
      return IconMetamask;
    case ProviderNames.imToken:
      return IconImToken;
  }
};

export default InputCryptoAddr;
