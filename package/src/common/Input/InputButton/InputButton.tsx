import React, { useCallback } from "react";
import { InputButtonProps } from "./InputButton.models";
import classes from "./InputButton.module.css";
import HintIcon from "../../HintIcon";
import arrowDownIcon from "../../../icons/arrow-down.svg";
import hintIcon from "../../../icons/hint.svg";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

const InputButton = React.forwardRef<HTMLDivElement, InputButtonProps>(
  (props, ref) => {
    const {
      selectedOption,
      label,
      icon,
      className,
      iconPosition,
      error,
      network,
    } = props;

    const generateIconClassName = useCallback(
      () =>
        `${classes["input-wrapper-child"]} ${classes["input-icon"]} ${
          iconPosition === "end" ? classes["input-wrapper-child-old-first"] : ""
        }`,
      [iconPosition]
    );
    const iconClassName = generateIconClassName();

    return (
      <div ref={ref} className={`${classes.wrapper} ${className}`}>
        {label && (
          <label>
            {label}
            {props.onHelpClick && (
              <>
                &nbsp;&nbsp;
                <HintIcon onClick={props.onHelpClick} />
              </>
            )}
          </label>
        )}

        <div
          onClick={props.onClick}
          className={`${classes["input-wrapper"]} ${
            classes["input-wrapper-selector"]
          } ${
            error || error === "" ? classes["input-wrapper-selector-error"] : ""
          } ${props.onClick ? "" : classes["input-wrapper-selector-disabled"]}`}
        >
          {icon && <img alt="Icon" src={icon} className={iconClassName} />}
          {props.renderIconSvg &&
            props.renderIconSvg({ className: iconClassName })}

          <span
            style={{ order: iconPosition === "end" ? -1 : "unset" }}
            className={`${classes["input-wrapper-child"]} ${
              classes["option-text"]
            } ${
              iconPosition === "end"
                ? classes["input-wrapper-child-new-first"]
                : ""
            }`}
          >
            {selectedOption}
          </span>

          {network && (
            <div className={`${classes["network-bubble"]}`}>{network}</div>
          )}

          {props.onClick && (
            <img
              alt="Chevron right"
              src={arrowDownIcon}
              className={`${classes["input-wrapper-child"]} ${classes["arrow-icon"]}`}
            />
          )}
        </div>

        <ErrorMessage
          text={props.error}
          className={`${classes["text-error-wrapper"]}`}
        />

        {props.hint && (
          <div className={`${classes["text-under"]}`}>
            <img src={hintIcon} />
            <span> {props.hint}</span>
          </div>
        )}
      </div>
    );
  }
);

InputButton.defaultProps = {
  className: "",
  iconPosition: "start",
  selectedOption: "",
};

export default InputButton;
