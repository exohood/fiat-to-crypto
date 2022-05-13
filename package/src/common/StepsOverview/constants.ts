import { CSSProperties } from "react";
import classes from "./StepsOverview.module.css";

export const styleVariables = {
  default: {
    "--border-color": "var(--input-stroke-color)",
    "--border-size": "1.5px",
    "--border-size-dot": "2px",
    "--icon-size": "32px",
    "--dot-size": "10px",
  } as CSSProperties,
  primary: {
    "--border-color": "var(--list-active-color)",
    "--border-size": "2px",
    "--border-size-dot": "3px",
    "--icon-size": "32px",
    "--dot-size": "16px",
  } as CSSProperties,
};

export const transitionClasses = {
  enter: classes["details-enter"],
  enterActive: classes["details-enter-active"],
  exit: classes["details-exit"],
  exitActive: classes["details-exit-active"],
};
