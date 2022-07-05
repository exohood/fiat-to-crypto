import { ReactChild } from "react";
import type { DateType } from "../../Input/DatePicker";

export type InputFacadeProps = {
  max?: string;
  disabled?: boolean;
  symbol?: string;
  placeholder?: string;
  label?: string;
  className?: string;
  icon?: string;
  iconPosition?: "start" | "end";
  symbolPosition?: "start" | "end";
  onChange?: (name: string, value: any, type?: string) => void;
  value?: number | string | DateType;
  type?: string;
  name: string;
  onIconClick?: (name: string, value: string, label: string) => void;
  error?: string;
  hint?: string;
  hintButton?: boolean;
  onHintClick?: () => void;
  onClick?: () => void;
  clickableIcon?: boolean;
  maxLength?: number;
  info?: string;
  iconTitle?: string;
  isRequired?: boolean;
};

export type BaseInputProps = Omit<InputFacadeProps, "onChange"> & {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void | boolean;
  iconClassName?: "icon-chevron" | "icon-date";
  inputSupportFallbackNode?: ReactChild;
  inputNotSupported?: boolean;
  formatValue?: (value?: any) => string;
};
