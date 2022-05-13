import React from "react";
import styles from "./InputDropdown.module.css";
import commonStyles from "./../../../styles.module.css";
import { idGenerator } from "../../../utils";
import { InputDropdownProps } from "./InputDropdown.models";
import DropdownHandle from "../../../common/DropdownHandle/DropdownHandle";
import ErrorMessage from "../../../common/ErrorMessage/ErrorMessage";

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${styles["wrapper"]} ${className || ""}`}>
    <div
      className={`${styles["content-wrapper"]} ${commonStyles["skeleton-box"]}`}
    ></div>
  </div>
);

const InputDropdown: React.FC<InputDropdownProps> = (
  props: InputDropdownProps
) => {
  const [id] = React.useState(idGenerator());

  if (props.isInitialLoading) {
    return <Skeleton className={props.className} />;
  }

  return (
    <div
      className={`${styles["wrapper"]} ${
        props.error ? styles["has-error"] : ""
      } ${props.className || ""}`}
    >
      <div className={styles["content-wrapper"]}>
        <div className={styles["input-wrapper"]}>
          <label htmlFor={id} className={styles["label"]}>
            {props.label}
          </label>
          <input
            disabled={props.disabled}
            onFocus={props.onFocus || (() => {})}
            onChange={props.onChange}
            type="text"
            id={id}
            value={props.value}
            className={styles["input"]}
          />
        </div>
        <DropdownHandle
          {...props.handleProps}
          className={styles["dropdown-handle"]}
        />
      </div>

      <ErrorMessage text={props.error} className={styles["error-wrapper"]} />
    </div>
  );
};

export default InputDropdown;
