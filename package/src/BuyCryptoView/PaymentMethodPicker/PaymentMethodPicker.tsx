import React, { useEffect, useState, useRef, useCallback } from "react";
import { ItemType } from "../../ApiContext";
import { PaymentMethodPickerProps } from "./PaymentMethodPicker.models";
import styles from "./PaymentMethodPicker.module.css";
import commonStyles from "../../styles.module.css";
import { useTranslation } from "react-i18next";

const Skeleton = React.forwardRef<
  HTMLUListElement,
  { maxLength: number; style: React.CSSProperties }
>(({ maxLength, style }, ref) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={`${styles.title}`}>
        <span>{t("buyCryptoView.paymentMethod")}</span>
      </div>

      <ul
        className={styles.wrapper}
        style={{ maxWidth: "100%", ...style }}
        ref={ref}
      >
        {[...[1, 2, 3, 4, 5].slice(0, maxLength), 1].map(
          (n: any, i: number) => (
            <li
              itemProp="option"
              key={i}
              className={`${styles["option-wrapper"]} ${commonStyles["skeleton-box"]} ${styles["skeloton-option"]}`}
            >
              <div className={styles["option-logo-wrapper"]}></div>
              <div className={styles["option-label"]}></div>
            </li>
          )
        )}
      </ul>
    </>
  );
});

const getOptionNodeSpacing = (optionNode: Element) => {
  const itemCss = getComputedStyle(optionNode);
  const marginRight = Number(itemCss.marginRight.replace("px", ""));
  const width =
    window.innerWidth < 320
      ? optionNode.getBoundingClientRect().width
      : Number(itemCss.minWidth.replace("px", ""));

  return {
    marginRight,
    width,
  };
};

const PaymentMethodPicker: React.FC<PaymentMethodPickerProps> = (
  props: PaymentMethodPickerProps
) => {
  const { t } = useTranslation();
  const [maxLength, _setMaxLength] = useState(2);
  const [maxLengthUpdated, setMaxLengthUpdated] = useState<number>(0);
  const [items, setItems] = useState(props.items);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const containerRef = useRef<HTMLUListElement>(null);
  const itemsLengthRef = useRef<Number>(items.length);

  const setMaxLength = (value: number) => {
    _setMaxLength(value);
    setMaxLengthUpdated(Date.now());
  };

  const calculateDistribution = useCallback(() => {
    if (itemsLengthRef.current === 1) {
      setMaxLength(1);
      return;
    }

    if (!containerRef.current) return;

    const optionNode =
      containerRef.current.querySelector(`[itemProp="option"]`);
    if (!optionNode) return;

    const { width, marginRight } = getOptionNodeSpacing(optionNode);

    const availableWidth = containerRef.current.clientWidth - width;
    const cellWidth = width + marginRight;

    const maxLengthAux = Math.floor(availableWidth / cellWidth);
    setMaxLength(maxLengthAux > 0 ? maxLengthAux : 0);
  }, []);

  const getRemainingWidth = () => {
    if (!containerRef.current) return -1;

    const optionNodes =
      containerRef.current.querySelectorAll(`[itemProp="option"]`);
    if (optionNodes.length === 0) return -1;

    const { width: itemMinWidth, marginRight } = getOptionNodeSpacing(
      optionNodes[0]
    );

    let width = containerRef.current.clientWidth;
    for (let i = 0; i < optionNodes.length; i++) {
      width -= itemMinWidth;

      if (i < optionNodes.length - 1) {
        width -= marginRight;
      }
    }

    return width;
  };

  const setItemsAux = (list: ItemType[]) => {
    itemsLengthRef.current = list.length;
    setItems(list);
  };

  useEffect(() => {
    setTimeout(() => {
      const remainingWidth = getRemainingWidth();
      if (remainingWidth >= 0 && remainingWidth < 36) {
        setStyle({ justifyContent: "space-between" });
        return;
      }
      setStyle({});
    }, 10);
  }, [maxLengthUpdated]);

  useEffect(() => {
    window.addEventListener("resize", calculateDistribution);
    return () => {
      window.removeEventListener("resize", calculateDistribution);
    };
  }, [calculateDistribution]);

  useEffect(() => {
    setTimeout(() => {
      calculateDistribution();
    }, 0);
  }, [calculateDistribution, props.isLoading]);

  useEffect(() => {
    const getListWithSelected = (): ItemType[] => {
      const sourceList =
        props.items.length === items.length &&
        props.items.every((sItem: ItemType) =>
          items.some((item) => item.id === sItem.id)
        )
          ? items
          : props.items;

      if (!props.selectedId) return sourceList;

      if (
        sourceList
          .slice(0, maxLength)
          .some((i: ItemType) => i.id === props.selectedId)
      )
        return sourceList;

      const selected = sourceList.find(
        (i: ItemType) => i.id === props.selectedId
      );
      if (!selected) return sourceList;

      return [
        selected,
        ...sourceList.filter((i: ItemType) => i.id !== props.selectedId),
      ];
    };

    const newList = getListWithSelected();
    if (
      newList.length !== items.length ||
      !newList.every(
        (item: ItemType, index: number) =>
          items.findIndex((i: ItemType) => i.id === item.id) === index
      )
    ) {
      setItemsAux(newList);
      calculateDistribution();
    }
  }, [calculateDistribution, items, maxLength, props.items, props.selectedId]);

  if (props.isLoading)
    return <Skeleton style={style} maxLength={maxLength} ref={containerRef} />;

  const numChildren = maxLength + (maxLength < props.items.length ? 1 : 0);

  return (
    <>
      <div className={styles.title}>{t("buyCryptoView.paymentMethod")}</div>

      <ul
        ref={containerRef}
        className={styles.wrapper}
        style={style}
        num-children={numChildren}
      >
        {items.slice(0, maxLength).map((item: ItemType, i: number) => (
          <li
            itemProp="option"
            key={i}
            className={`${styles["option-wrapper"]} ${
              item.id === props.selectedId ? " " + styles.selected : ""
            }`}
            onClick={() => props.onChange(item)}
          >
            {item.icon && (
              <div className={styles["option-logo-wrapper"]}>
                <img alt="Icon" src={item.icon} />
              </div>
            )}
            <div className={styles["option-label"]}> {item.name} </div>
          </li>
        ))}

        {maxLength < props.items.length && (
          <li
            itemProp="option"
            className={styles["option-wrapper"]}
            onClick={() => props.openMoreOptions && props.openMoreOptions()}
          >
            <div className={styles["option-logo-wrapper"]}>
              <span>+{props.items.length - maxLength}</span>
            </div>
            <div className={styles["option-label"]}> Other </div>
          </li>
        )}
      </ul>
    </>
  );
};

export default PaymentMethodPicker;
