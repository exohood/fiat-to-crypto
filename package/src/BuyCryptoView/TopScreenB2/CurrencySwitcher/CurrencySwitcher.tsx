import React, { useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styles from "./CurrencySwitcher.module.css";
import commonStyles from "./../../../styles.module.css";
import DropdownHandle from "../../../common/DropdownHandle/DropdownHandle";
import arrowRightIcon from "./../../../icons/arrow-right.svg";
import { APIContext, ItemType } from "../../../ApiContext";
import { NavContext } from "../../../NavContext";
import { popularCrypto } from "../../constants";
import { arrayUnique } from "../../../utils";
import { ItemCategory } from "./../../../ApiContext/initialState";
import OverlayPicker from "../../../common/OverlayPicker/OverlayPicker";
import { ViewListItemType } from "../../../common/ViewList/ViewList.models";
import CryptoListItemRight from "../../CryptoListItemRight/CryptoListItemRight";
import { CurrencyIcon } from "@onramper/flag-icons";

const Skeleton: React.FC = () => {
  const handleJsx = (
    <DropdownHandle
      icon={""}
      value={"Lor"}
      className={commonStyles["skeleton-box"]}
      disabled={true}
      onClick={() => {}}
    />
  );

  return (
    <div className={styles["switcher-wrapper"]}>
      {handleJsx}
      <button className={commonStyles["btn-default"]} disabled={true}>
        <img
          className={styles["arrow-right"]}
          src={arrowRightIcon}
          alt="arrow-right"
        />
      </button>
      {handleJsx}
    </div>
  );
};

const CurrencySwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { collected, data } = useContext(APIContext);
  const { nextScreen, backScreen } = useContext(NavContext);

  const [pair, setPair] = useState<
    ({ item?: ItemType; hasOptions: boolean } | undefined)[]
  >([]);

  const handleItemClick = useCallback(
    (name: string, index: number, item: ItemType) => {
      if (name === "crypto") data.handleCryptoChange(item);
      else if (name === "currency") data.handleCurrencyChange(item);

      backScreen();
    },
    [backScreen, data]
  );

  const getSortedCryptoListItem = useCallback(() => {
    const prioritizedCrypto = !collected.recommendedCryptoCurrencies
      ? popularCrypto
      : arrayUnique([
          ...collected.recommendedCryptoCurrencies,
          ...popularCrypto,
        ]);

    return prioritizedCrypto
      .map((c) => data.availableCryptos.filter((crypto) => crypto.id === c)[0])
      .filter((c) => c !== undefined)
      .concat(
        data.availableCryptos
          .filter((crypto) => !prioritizedCrypto.includes(crypto.id))
          .sort((a, b) => (a.id === b.id ? 0 : a.id > b.id ? 1 : -1))
      )
      .map(
        (item) =>
          ({
            ...item,
            rightSection: <CryptoListItemRight network={item.network} />,
          } as ViewListItemType)
      );
  }, [collected.recommendedCryptoCurrencies, data.availableCryptos]);

  const openPickCrypto = useCallback(() => {
    if (data.availableCryptos.length > 1) {
      const items = getSortedCryptoListItem();

      nextScreen(
        <OverlayPicker
          name="crypto"
          indexSelected={items.findIndex(
            (m) => m.id === collected.selectedCrypto?.id
          )}
          title={t("header.selectCrypto")}
          items={items}
          onItemClick={handleItemClick}
          searchable
        />
      );
    }
  }, [
    collected.selectedCrypto?.id,
    data.availableCryptos.length,
    getSortedCryptoListItem,
    handleItemClick,
    nextScreen,
    t,
  ]);

  const openPickCurrency = useCallback(() => {
    if (data.availableCurrencies.length > 1) {
      nextScreen(
        <OverlayPicker
          name="currency"
          title={t("header.selectFiat")}
          indexSelected={data.availableCurrencies.findIndex(
            (m) => m.id === collected.selectedCurrency?.id
          )}
          items={data.availableCurrencies.map((i) => ({
            ...i,
            iconSvg: <CurrencyIcon name={i.id} />,
          }))}
          onItemClick={handleItemClick}
          searchable
        />
      );
    }
  }, [
    collected.selectedCurrency?.id,
    data.availableCurrencies,
    handleItemClick,
    nextScreen,
    t,
  ]);

  const handleDropdown = useCallback(
    (item?: ItemType) => {
      if (item?.currencyType === ItemCategory.Crypto) {
        return openPickCrypto();
      }

      openPickCurrency();
    },
    [openPickCrypto, openPickCurrency]
  );

  const getIconClassName = useCallback(
    (item?: ItemType) =>
      item?.currencyType === ItemCategory.Crypto
        ? styles["crypto-icon"]
        : styles["fiat-icon"],
    []
  );

  useEffect(() => {
    setPair([
      {
        item: collected.selectedCurrency,
        hasOptions: data.availableCurrencies.length > 1,
      },
      {
        item: collected.selectedCrypto,
        hasOptions: getSortedCryptoListItem().length > 1,
      },
    ]);
  }, [
    collected.amountInCrypto,
    collected.selectedCurrency,
    collected.selectedCrypto,
    data.availableCurrencies.length,
    data.availableCryptos.length,
    getSortedCryptoListItem,
  ]);

  if (pair.length === 0 || pair.some((i) => !i || i.item?.name === undefined)) {
    return <Skeleton />;
  }

  return (
    <div className={styles["switcher-wrapper"]}>
      <DropdownHandle
        icon={pair[0]?.item?.icon}
        value={pair[0]?.item?.name || ""}
        iconClassname={getIconClassName(pair[0]?.item)}
        onClick={() => handleDropdown(pair[0]?.item)}
        disabled={!pair[0]?.hasOptions}
      />

      <div className={commonStyles["flex-all"]}>
        <img
          className={styles["arrow-right"]}
          src={arrowRightIcon}
          alt="arrow-right"
        />
      </div>

      <DropdownHandle
        icon={pair[1]?.item?.icon}
        value={pair[1]?.item?.name || ""}
        iconClassname={getIconClassName(pair[1]?.item)}
        onClick={() => handleDropdown(pair[1]?.item)}
        disabled={!pair[1]?.hasOptions}
      />
    </div>
  );
};

export default CurrencySwitcher;
