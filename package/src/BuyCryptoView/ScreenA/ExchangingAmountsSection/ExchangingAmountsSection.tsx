import React, { useState, useCallback, useContext, useEffect } from "react";
import style from "./ExchangingAmountsSection.module.css";
import InputDropdown from "../InputDropdown/InputDropdown";
import { ItemCategory, APIContext, ItemType } from "../../../ApiContext";
import {
  onChangeTextNumber,
  toStringOrDefault,
  arrayUnique,
} from "../../../utils";
import { popularCrypto } from "../../constants";
import { NavContext } from "../../../NavContext";
import CryptoListItemRight from "../../CryptoListItemRight/CryptoListItemRight";
import { ViewListItemType } from "../../../common/ViewList/ViewList.models";
import OverlayPicker from "../../../common/OverlayPicker/OverlayPicker";
import { useTranslation } from "react-i18next";

const ExchangingAmountsSection: React.FC = () => {
  const { t } = useTranslation();
  const {
    collected,
    inputInterface: { handleInputChange },
    data,
  } = useContext(APIContext);
  const { nextScreen, backScreen } = useContext(NavContext);

  const [amounts, setAmounts] = useState<{ [key: string]: string }>({
    [ItemCategory.Currency]: "0",
    [ItemCategory.Crypto]: "0",
  });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );

  const onChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      category: ItemCategory,
      precision: number | undefined
    ) => {
      const value = onChangeTextNumber(e.target.value, precision || 1);
      if (value === false) return false;

      if (category === ItemCategory.Currency && collected.amountInCrypto) {
        handleInputChange("amountInCrypto", false);
      }

      if (category === ItemCategory.Crypto && !collected.amountInCrypto) {
        handleInputChange("amountInCrypto", true);
      }
      handleInputChange("amount", value);
    },
    [collected.amountInCrypto, handleInputChange]
  );

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
          items={data.availableCurrencies}
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

  useEffect(() => {
    const updateAmounts = () => {
      if (!collected.amountInCrypto) {
        return setAmounts({
          [ItemCategory.Currency]: toStringOrDefault(collected.amount),
          [ItemCategory.Crypto]: toStringOrDefault(
            collected.bestExpectedCrypto
          ),
        });
      }

      return setAmounts({
        [ItemCategory.Currency]: toStringOrDefault(
          collected.bestExpectedCrypto
        ),
        [ItemCategory.Crypto]: toStringOrDefault(collected.amount),
      });
    };

    updateAmounts();
  }, [
    collected.amount,
    collected.amountInCrypto,
    collected.bestExpectedCrypto,
  ]);

  useEffect(() => {
    const recalculateUnFocusedInput = () => {
      let lowest = collected.amountInCrypto
        ? Number.POSITIVE_INFINITY
        : Number.NEGATIVE_INFINITY;
      const comparator = (tmp: number, lowest: number) =>
        collected.amountInCrypto ? tmp < lowest : tmp > lowest;

      const pricedRates = data.allRates.filter((item) => item.available);
      let index = 0;
      let tmp: number;
      for (let i = pricedRates.length - 1; i >= 0; i--) {
        tmp = pricedRates[i].receivedCrypto ?? 0;
        if (comparator(tmp, lowest)) {
          lowest = tmp;
          index = i;
        }
      }

      const unFocusedUnit = collected.amountInCrypto
        ? collected.selectedCrypto
        : collected.selectedCrypto;
      let value = pricedRates[index]?.receivedCrypto ?? 0;

      if (value !== 0 && unFocusedUnit) {
        value = Number(
          onChangeTextNumber(toStringOrDefault(value), unFocusedUnit?.precision)
        );
      }
      handleInputChange("bestExpectedCrypto", value);
    };

    recalculateUnFocusedInput();
  }, [
    data.allRates,
    collected.amountInCrypto,
    handleInputChange,
    collected.selectedCrypto,
  ]);

  useEffect(() => {
    if (["MIN", "MAX"].some((i) => i === collected.errors?.RATE?.type)) {
      setErrors({
        [ItemCategory.Currency]: !collected.amountInCrypto
          ? collected.errors?.RATE?.message
          : undefined,
        [ItemCategory.Crypto]: collected.amountInCrypto
          ? collected.errors?.RATE?.message
          : undefined,
      });
    } else {
      setErrors({});
    }
  }, [collected.amountInCrypto, collected.errors]);

  return (
    <div className={style["wrapper"]}>
      {[
        {
          target: collected.selectedCurrency,
          type: ItemCategory.Currency,
          label: "You spend",
          iconClassname: style["fiat-icon"],
          className: style["wrapper-input-dropdown"],
          disabled: !!collected.amountInCrypto && collected.isCalculatingAmount,
          isOneOption: data.availableCurrencies.length === 1,
        },
        {
          target: collected.selectedCrypto,
          type: ItemCategory.Crypto,
          label: "You receive",
          className: style["wrapper-input-dropdown"],
          iconClassname: style["crypto-icon"],
          disabled: !collected.amountInCrypto && collected.isCalculatingAmount,
          isOneOption: getSortedCryptoListItem().length === 1,
        },
      ].map((item, index) => (
        <InputDropdown
          key={index}
          className={item.className}
          label={item.label}
          value={amounts[item.type]}
          disabled={!!item.disabled}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange(e, item.type, item.target?.precision) === false)
              return false;
          }}
          handleProps={{
            icon: item.target?.icon,
            value: item.target?.name || "",
            iconClassname: item.iconClassname,
            onClick: () => handleDropdown(item.target),
            disabled: item.isOneOption,
          }}
          isInitialLoading={
            !collected.selectedCurrency || !collected.selectedCrypto
          }
          error={errors[item.type]}
        />
      ))}
    </div>
  );
};

export default ExchangingAmountsSection;
