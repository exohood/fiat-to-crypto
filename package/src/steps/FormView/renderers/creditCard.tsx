import React, { useState } from "react";
import stylesCommon from "../../../styles.module.css";
import InputDelegator from "../../../common/Input/InputDelegator";

type CreditCardInputType = {
  handleInputChange: (name: string, value: any) => void;
  errorObj?: { [key: string]: string | undefined };
  ccNumberValue?: string;
  ccMonthValue?: string;
  ccYearValue?: string;
  ccCVVValue?: string;
  fieldsGroup?: { [key: string]: any };
};

const CreditCardInput = React.forwardRef<HTMLDivElement, CreditCardInputType>(
  (props, ref) => {
    const {
      ccNumberValue = "",
      ccMonthValue = "",
      ccYearValue = "",
      ccCVVValue = "",
    } = props;

    const [isSlashed, setIsSlashed] = useState(false);

    const formatCardNumber = (value: string) => {
      const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
      const onlyNumbers = value.replace(/[^\d]/g, "");

      return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
        [$1, $2, $3, $4].filter((group) => !!group).join(" ")
      );
    };

    const formatExpiryDate = (value: string) => {
      if (isSlashed && value.length === 2) return value + " / ";

      const regex = /^(\d{0,2})(\d{0,2})$/g;
      const onlyNumbers = value.replace(/[^\d]/g, "");

      return onlyNumbers.replace(regex, (regex, $1, $2) =>
        [$1, $2].filter((group) => !!group).join(" / ")
      );
    };

    const onChange = (name: string, v: string) => {
      let value = v;
      if (name === "ccExpiration") {
        if (!isSlashed && value.length === 2) {
          setIsSlashed(true);
        } else if (isSlashed && value.length === 4) {
          setIsSlashed(false);
          value = value.substr(0, 1);
        }

        const month = value.split("/")[0].replace(" ", "");
        const year = (value.split("/")[1] ?? "").replace(" ", "");
        if (year.length > 2 || month.length > 2) return;
        props.handleInputChange("ccMonth", month);
        props.handleInputChange("ccYear", "20" + year);
      } else if (name === "ccNumber") {
        const ccNumberValue = formatCardNumber(value.replace(/ /g, "")).replace(
          / /g,
          ""
        );
        if (ccNumberValue.length > 16) return;
        props.handleInputChange(name, ccNumberValue);
      } else {
        props.handleInputChange(name, value);
      }
    };

    return (
      <form className={stylesCommon.body__child}>
        <InputDelegator
          ref={ref}
          className={stylesCommon.body__child}
          label="Card number"
          name="ccNumber"
          error={props.errorObj?.ccNumber}
          onChange={onChange}
          placeholder="4111 1111 1111 1111"
          value={formatCardNumber(ccNumberValue)}
          hint={props.fieldsGroup?.["ccNumber"]?.hint}
        />
        <div
          className={`${stylesCommon.body__child} ${stylesCommon["row-fields"]}`}
        >
          <InputDelegator
            className={stylesCommon["row-fields__child"]}
            label="Expiry date"
            name="ccExpiration"
            error={props.errorObj?.ccMonth || props.errorObj?.ccYear}
            onChange={onChange}
            placeholder="MM/YY"
            value={formatExpiryDate(
              `${ccMonthValue}${ccYearValue.substring(2, 4)}`
            )}
            hint={props.fieldsGroup?.["ccExpiration"]?.hint}
          />
          <InputDelegator
            className={stylesCommon["row-fields__child"]}
            label="CCV"
            name="ccCVV"
            error={props.errorObj?.ccCVV}
            onChange={onChange}
            placeholder="123"
            value={ccCVVValue}
            type="password"
            maxLength={3}
            hint={props.fieldsGroup?.["ccCVV"]?.hint}
          />
        </div>
      </form>
    );
  }
);

export default CreditCardInput;
