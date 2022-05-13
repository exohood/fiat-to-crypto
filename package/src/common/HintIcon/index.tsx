import React from "react";
import styles from "./styles.module.css";
import { ReactComponent as IconHint } from "../../icons/hint.svg";

type HintIconType = {
  onClick?: () => void;
};

const HintIcon: React.FC<HintIconType> = (props) => {
  return (
    <span onClick={props.onClick} className={styles["tooltip-help"]}>
      <IconHint className={`${styles.icon} ${styles["icon-question"]}`} />
    </span>
  );
};

export default HintIcon;
