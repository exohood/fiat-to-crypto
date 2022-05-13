import React, { useContext, useState } from "react";
import BaseInput from "./BaseInput/BaseInput";
import { InputFacadeProps } from "./BaseInput/BaseInput.models";
import iconCalendar from "../../icons/date-input.png";
import { NavContext } from "../../NavContext";
import DatePicker, { DateType } from "../Input/DatePicker";
import DateModule from "../Input/DatePicker/DateModule";

const DateInput = React.forwardRef<HTMLDivElement, InputFacadeProps>(
  (props, ref) => {
    const { backScreen, nextScreen } = useContext(NavContext);

    const [inputNotSupported] = useState(!isTypeSupported("date"));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      const date = {
        year: value.split("-")[0],
        month: value.split("-")[1],
        day: value.split("-")[2],
      };

      props.onChange?.(e.currentTarget.name, date, e.currentTarget.type);
    };

    const formatValue = (value?: any) => {
      if (!value) return value;

      const year = ("0000" + String(value.year)).slice(-4);
      const month = ("00" + String(value.month)).slice(-2);
      const day = ("00" + String(value.day)).slice(-2);
      return `${year}-${month}-${day}`;
    };

    const onIconClick = (name: string, value: string, label: string) => {
      if (inputNotSupported) {
        nextScreen(
          <DatePicker
            name={props.name}
            onChange={(name, value) => {
              props.onChange?.(name, value);
              backScreen();
            }}
            value={props.value as DateType}
          />
        );
        return;
      }

      props.onIconClick?.(name, value, label || "\u00A0");
    };

    const icon = inputNotSupported ? iconCalendar : props.icon;
    const iconPosition = inputNotSupported ? "end" : props.iconPosition;
    const iconClassName = inputNotSupported ? "icon-date" : undefined;

    const inputAlternative = inputNotSupported ? (
      <DateModule
        name={props.name}
        value={formatValue(props.value)}
        onChange={props.onChange}
      />
    ) : undefined;

    return (
      <BaseInput
        {...props}
        ref={ref}
        icon={icon}
        iconPosition={iconPosition}
        type="date"
        max="9999-12-31"
        onIconClick={onIconClick}
        handleInputChange={handleInputChange}
        iconClassName={iconClassName}
        formatValue={formatValue}
        inputNotSupported={inputNotSupported}
        inputSupportFallbackNode={inputAlternative}
      />
    );
  }
);

const isTypeSupported = (type: string) => {
  const datefield = document.createElement("input");
  datefield.setAttribute("type", type);
  return datefield.type === type;
};

export default DateInput;
