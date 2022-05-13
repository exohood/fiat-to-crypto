import React from "react";
import { CheckboxProps } from "./Checkbox.models";
import classes from "./Checkbox.module.css";

const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <div
      className={`${classes["wrapper"]} ${props.className || ""} ${
        props.disabled ? classes["disabled"] : ""
      }`}
    >
      <input
        disabled={props.disabled}
        readOnly={!props.onClick}
        type="checkbox"
        checked={props.checked}
        onClick={props.onClick}
      />
      <div className={classes["check"]}>
        <div className={classes["circle"]}> </div>
      </div>
    </div>
  );
};

export default Checkbox;
