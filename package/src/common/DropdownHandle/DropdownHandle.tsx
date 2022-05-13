import React from "react";
import styles from "./DropdownHandle.module.css";
import arrowDownIcon from "./../../icons/arrow-down.svg";
import { DropdownHandleProps } from "./DropdownHandle.models";

const DropdownHandle: React.FC<DropdownHandleProps> = ({
  icon,
  value,
  className,
  iconClassname,
  onClick,
  disabled = false,
}) => {
  return (
    <div
      className={`${styles["handle-wrapper"]} ${className || ""} ${
        disabled ? styles["disabled"] : ""
      }`}
      onClick={() => !disabled && onClick(value)}
    >
      <div
        className={`${styles["icon-handle-wrapper"]} ${iconClassname || ""}`}
      >
        {icon && (
          <img
            className={styles["icon-handle"]}
            src={icon}
            alt="icon-dropdown"
          />
        )}
      </div>

      <span className={styles["value-dropdown"]}>{value}</span>
      <img className={styles["icon-down"]} src={arrowDownIcon} />
    </div>
  );
};

export default DropdownHandle;
