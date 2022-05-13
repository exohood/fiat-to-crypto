import React from "react";
import { useTranslation } from "react-i18next";
import { TabGroupProps } from "./TabGroup.models";
import styles from "./TabGroup.module.css";

const TabGroup: React.FC<TabGroupProps> = (props: TabGroupProps) => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      {props.items.map((label: string, i: number) => (
        <div
          onClick={() => props.onClickItem(i)}
          key={i}
          className={`${styles["option-wrapper"]} ${
            i === props.indexSelected ? styles.selected : ""
          }`}
        >
          {t(label)}
        </div>
      ))}
    </div>
  );
};
export default TabGroup;
