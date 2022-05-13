import React from "react";
import BaseInput from "./BaseInput/BaseInput";
import { InputFacadeProps } from "./BaseInput/BaseInput.models";
import DateInput from "./DateInput";
import NumberInput from "./NumberInput";

const InputDelegator = React.forwardRef<HTMLDivElement, InputFacadeProps>(
  (props, ref) => {
    if (props.type === "number") {
      return <NumberInput ref={ref} {...props} />;
    }

    if (props.type === "date") {
      return <DateInput ref={ref} {...props} />;
    }

    return (
      <BaseInput
        {...props}
        ref={ref}
        handleInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          props.onChange?.(
            e.currentTarget.name,
            e.currentTarget.value,
            e.currentTarget.type
          );
        }}
      />
    );
  }
);

export default InputDelegator;
