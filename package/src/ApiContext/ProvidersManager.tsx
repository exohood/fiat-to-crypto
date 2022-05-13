import ERC20COINS from "./utils/erc20Coins";

export enum ProviderNames {
  Metamask = "Metamask",
  imToken = "imToken",
}

export class ProviderManager {
  static providerName: ProviderNames | undefined;

  private static _cryptoCode: string | undefined;

  private static _cryptoName: string | null = null;

  static providerIsPresent = (cryptoCode?: string, cryptoName?: string) => {
    if (!cryptoCode || !cryptoName) return false;
    if (ERC20COINS.includes(cryptoCode.toUpperCase()))
      return typeof window.ethereum !== "undefined";
  };

  static connect = (cryptoCode: string, cryptoName?: string) => {
    ProviderManager.providerName = undefined;
    ProviderManager._cryptoCode = cryptoCode.toUpperCase();
    ProviderManager._cryptoName = cryptoName ? cryptoName.toUpperCase() : null;
    if (ERC20COINS.includes(ProviderManager._cryptoCode.toUpperCase()))
      ProviderManager._cryptoName = "ETHEREUM";

    // IMTOKEN
    if (
      ProviderManager.IMTOKEN_supportedCryptos.includes(
        cryptoCode.toUpperCase()
      ) ||
      (ProviderManager.IMTOKEN_supportedCryptos.includes("ETH") &&
        ERC20COINS.includes(cryptoCode.toUpperCase()))
    ) {
      if (!(typeof window.ethereum !== "undefined")) return false;
      if (window.ethereum.isImToken) {
        ProviderManager.providerName = ProviderNames.imToken;
        return true;
      }
    }

    // METAMASK
    if (ERC20COINS.includes(cryptoCode.toUpperCase())) {
      if (!(typeof window.ethereum !== "undefined")) return false;
      if (window.ethereum.isMetaMask) {
        ProviderManager.providerName = ProviderNames.Metamask;
        return true;
      }
    }

    return false;
  };

  static isdApp = () => {
    if (!ProviderManager.providerName) return false;
    if ([ProviderNames.imToken].includes(ProviderManager.providerName))
      return true;
  };

  static getAccounts = async (): Promise<
    { [cryptoCode: string]: string } | undefined
  > => {
    if (ProviderManager.providerName === ProviderNames.imToken)
      return ProviderManager.getImTokenAccounts();
    else if (ProviderManager.providerName === ProviderNames.Metamask)
      return ProviderManager.getMetamaskAccounts();
  };

  /**
   * metamask
   */

  static getMetamaskAccounts = async () => {
    try {
      const ethereum = window.ethereum;
      if (!ethereum) return;
      const eth_account = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return ERC20COINS.reduce(
        (acc, act) => ({ ...acc, [act]: eth_account[0] }),
        {}
      );
    } catch {
      return undefined;
    }
  };

  /**
   * imToken
   */

  static IMTOKEN_supportedCryptos = [
    "ETH",
    "BTC",
    "ATOM",
    "EOS",
    "TRX",
    "CKB",
    "BCH",
    "LTC",
    "KSM",
    "DOT",
    "FIL",
    "XTZ",
  ];

  static getImTokenAccounts = async () => {
    const imToken = (window as any).imToken;
    try {
      let accounts = {};
      /*     const eth_account = await window.ethereum!.enable();
      accounts = {
        ...accounts,
        ...ERC20COINS.reduce(
          (acc, act) => ({ ...acc, [act]: eth_account[0] }),
          {}
        ),
      }; */

      const account = await imToken.callPromisifyAPI("user.showAccountSwitch", {
        chainType: ProviderManager._cryptoName,
      });

      accounts = {
        ...accounts,
        [ProviderManager._cryptoCode ?? "default"]: account,
      };

      if (ProviderManager._cryptoName === "ETHEREUM")
        accounts = {
          ...accounts,
          ...ERC20COINS.reduce((acc, act) => ({ ...acc, [act]: account }), {}),
        };

      imToken.callAPI("native.toast", {
        type: "success",
        message: "Address successfully imported",
        align: "bottom",
        model: "banner",
        duration: 1000 * 3,
      });

      return accounts;
    } catch (error) {
      imToken.callAPI("native.toast", {
        type: "info",
        message: error.message,
        align: "top",
        model: "banner",
        duration: 1000 * 3,
      });
      return undefined;
    }
  };
}
