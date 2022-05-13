import React, {
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import styles from "./CurrencyInput.module.css";
import { APIContext } from "../../../ApiContext";
import { onChangeTextNumber } from "../../../utils";

const defaultPrecision = 2;

const CurrencyInput: React.FC = () => {
  const {
    collected,
    inputInterface: { handleInputChange },
  } = useContext(APIContext);

  const [isFocused, setIsFocused] = useState(false);
  const [precision, setPrecision] = useState(defaultPrecision);
  const [symbol, setSymbol] = useState<string | undefined>(undefined);
  const [hasError, setHasError] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);
  const resizeInput = (target: HTMLInputElement) => {
    target.style.width = `0px`;
    target.style.width = `${target.scrollWidth}px`;
  };

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): undefined | boolean => {
      const value = onChangeTextNumber(e.target.value, precision);
      if (value === false) return false;

      handleInputChange("amount", value);
    },
    [handleInputChange, precision]
  );

  useEffect(() => {
    setTimeout(() => {
      inputRef.current && resizeInput(inputRef.current);
    }, 0);
  }, [collected.amount]);

  useEffect(() => {
    const currentUnitOfCurrency = collected.amountInCrypto
      ? collected.selectedCrypto
      : collected.selectedCurrency;
    const getCurrentPrecision = () => {
      const nextPrecision = Number(currentUnitOfCurrency?.precision);
      return isNaN(nextPrecision) ? defaultPrecision : nextPrecision;
    };

    setPrecision(getCurrentPrecision());

    setSymbol(!collected.amountInCrypto ? currentUnitOfCurrency?.symbol : "");
  }, [
    collected.amountInCrypto,
    collected.selectedCurrency,
    collected.selectedCrypto,
  ]);

  useEffect(() => {
    setHasError(["MIN", "MAX"].some((i) => i === collected.errors?.RATE?.type));
  }, [collected.errors]);

  return (
    <div
      className={`${styles["input-box"]} ${
        isFocused ? styles["is-focused"] : ""
      } ${hasError ? styles["with-error"] : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      {symbol && (
        <span className={`${styles["text"]} ${styles["symbol"]}`}>
          {" "}
          {symbol}{" "}
        </span>
      )}
      <input
        ref={inputRef}
        id="editable-amount"
        className={`${styles["text"]} ${styles["input"]}`}
        placeholder="100"
        type="text"
        name="amount"
        value={`${collected.amount}`}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={!collected.isAmountEditable}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange(e) === false) return false;
        }}
      />
    </div>
  );
};

export default CurrencyInput;
