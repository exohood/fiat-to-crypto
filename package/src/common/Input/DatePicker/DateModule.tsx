import React, { MouseEventHandler, useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";

export const DEFAULT_VALUE = {
  day: "dd",
  month: "mm",
  year: "yyyy",
};

interface DateModuleType {
  name: string;
  value?: string;
  onChange?: (name: string, value: any, type?: string) => void;
}

const DateModule: React.FC<DateModuleType> = (props) => {
  const [selectedValue, setSelectedValue] = useState<string>();
  const [selectedCount, setSelectedCount] = useState(0);
  const inputRef = useRef<HTMLDivElement>(null);

  const { value = "yyyy-mm-dd" } = props;
  const valueObject = value
    ? {
        year: value.split("-")[0],
        month: value.split("-")[1],
        day: value.split("-")[2],
      }
    : DEFAULT_VALUE;

  const { onChange } = props;

  useEffect(() => {
    const reff = inputRef.current;
    if (reff === null) return;

    const callBack = (event: MouseEvent) => {
      const withinBoundaries = event.composedPath().includes(reff);
      if (!withinBoundaries) setSelectedValue(undefined);
    };

    document.addEventListener("click", callBack);

    return () => document.removeEventListener("click", callBack);
  }, []);

  useEffect(() => {
    const reff = inputRef.current;
    if (reff === null) return;

    const callBack = (event: KeyboardEvent) => {
      if (!selectedValue) return;

      if (event.key === "Tab") {
        event.preventDefault();
        if (selectedCount < 1) {
          setSelectedCount(2);
          setSelectedValue("month");
        } else if (selectedCount < 3) {
          setSelectedCount(4);
          setSelectedValue("year");
        } else {
          setSelectedValue(undefined);
        }
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        const newSelectedValue =
          selectedValue === "day"
            ? "month"
            : selectedValue === "month"
            ? "year"
            : selectedValue;
        const newSelectedCount =
          newSelectedValue === "month"
            ? 2
            : newSelectedValue === "year"
            ? 4
            : 0;
        setSelectedValue(newSelectedValue);
        setSelectedCount(newSelectedCount);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const newSelectedValue =
          selectedValue === "year"
            ? "month"
            : selectedValue === "month"
            ? "day"
            : selectedValue;
        const newSelectedCount =
          newSelectedValue === "month" ? 2 : newSelectedValue === "day" ? 0 : 4;
        setSelectedValue(newSelectedValue);
        setSelectedCount(newSelectedCount);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const lastYear = new Date().getFullYear() - 1;
        const currentValue =
          selectedValue === "year"
            ? value.split("-")[0]
            : selectedValue === "month"
            ? value.split("-")[1]
            : value.split("-")[2];
        let nextValue = Number.isInteger(+currentValue)
          ? +currentValue
          : selectedValue === "year"
          ? lastYear
          : 0;
        nextValue++;
        nextValue =
          selectedValue === "year"
            ? nextValue % 10000
            : selectedValue === "month"
            ? nextValue % 13
            : nextValue % 32;
        if (nextValue === 0)
          nextValue = selectedValue === "year" ? lastYear + 1 : nextValue + 1;
        let actualDate = date2Object(value);
        actualDate = {
          ...actualDate,
          [selectedValue]: nextValue,
        };
        onChange?.(props.name, actualDate, "date");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const lastYear = 10000;
        const currentValue =
          selectedValue === "year"
            ? value.split("-")[0]
            : selectedValue === "month"
            ? value.split("-")[1]
            : value.split("-")[2];
        let nextValue =
          Number.isInteger(+currentValue) && +currentValue > 0
            ? +currentValue
            : selectedValue === "year"
            ? lastYear
            : selectedValue === "month"
            ? 13
            : 32;
        nextValue--;
        nextValue =
          selectedValue === "year"
            ? nextValue % 10000
            : selectedValue === "month"
            ? nextValue % 13
            : nextValue % 32;
        if (nextValue === 0)
          nextValue =
            selectedValue === "year"
              ? 9999
              : selectedValue === "month"
              ? 12
              : 31;
        let actualDate = date2Object(value);
        actualDate = {
          ...actualDate,
          [selectedValue]: nextValue,
        };
        onChange?.(props.name, actualDate, "date");
      } else {
        if (!Number.isInteger(+event.key)) return;
        let key = event.key;

        if (selectedCount === 0) {
          if (+key > 3) {
            setSelectedCount(1);
            setSelectedValue("month");
          }
          key = "0" + key;
        } else if (selectedCount === 1) {
          const currentValue =
            selectedValue === "year"
              ? value.split("-")[0]
              : selectedValue === "month"
              ? value.split("-")[1]
              : value.split("-")[2];
          if (currentValue === "00") key = "01";
        } else if (selectedCount === 2) {
          if (+key > 1) {
            setSelectedCount(3);
            setSelectedValue("year");
          }
          key = "0" + key;
        } else if (selectedCount === 3) {
          const currentValue =
            selectedValue === "year"
              ? value.split("-")[0]
              : selectedValue === "month"
              ? value.split("-")[1]
              : value.split("-")[2];
          if (currentValue === "00") key = "01";
        } else if (selectedCount === 4) {
          key = "000" + key;
        }
        if (selectedCount > 6 && (selectedCount + 1) % 4 === 0) {
          const currentValue =
            selectedValue === "year"
              ? value.split("-")[0]
              : selectedValue === "month"
              ? value.split("-")[1]
              : value.split("-")[2];
          if ((currentValue + key).slice(-4) === "0000") key = "0001";
        }
        onChange?.(props.name, date2Object(value, key, selectedValue), "date");

        if (selectedCount === 1) {
          setSelectedValue("month");
        } else if (selectedCount === 3) {
          setSelectedValue("year");
        }

        setSelectedCount((old) => ++old);
      }
    };

    document.addEventListener("keydown", callBack);

    return () => document.removeEventListener("keydown", callBack);
  }, [onChange, props.name, selectedValue, value, selectedCount]);

  const onClick: MouseEventHandler<HTMLSpanElement> = (e) => {
    const id = e.currentTarget.id;
    if (id === "day" && selectedValue !== "day") setSelectedCount(0);
    else if (id === "month" && selectedValue !== "month") setSelectedCount(2);
    else if (id === "year" && selectedValue !== "year") setSelectedCount(4);

    setSelectedValue(e.currentTarget.id);
  };

  return (
    <div ref={inputRef} className={styles.date}>
      <span
        id="day"
        className={`${styles.noselect} ${
          selectedValue === "day" ? styles["date-item--selected"] : ""
        }`}
        onClick={onClick}
      >
        {valueObject.day}
      </span>
      <span className={styles.noselect}>/</span>
      <span
        id="month"
        className={`${styles.noselect} ${
          selectedValue === "month" ? styles["date-item--selected"] : ""
        }`}
        onClick={onClick}
      >
        {valueObject.month}
      </span>
      <span className={styles.noselect}>/</span>
      <span
        id="year"
        className={`${styles.noselect} ${
          selectedValue === "year" ? styles["date-item--selected"] : ""
        }`}
        onClick={onClick}
      >
        {valueObject.year}
      </span>
      <span
        onClick={() => {
          setSelectedCount(0);
          setSelectedValue((old) => old ?? "day");
        }}
        style={{ flexGrow: 1 }}
      ></span>
    </div>
  );
};

const date2Object = (value: string, key: string = "", id: string = "") => {
  const _value = value || "yyyy-mm-dd";
  const date = {
    year: _value.split("-")[0],
    month: _value.split("-")[1],
    day: _value.split("-")[2],
  };

  if (id === "year") date.year = ("0000" + date.year + key).slice(-4);
  else if (id === "month") date.month = ("00" + date.month + key).slice(-2);
  else if (id === "day") date.day = ("00" + date.day + key).slice(-2);

  return {
    year: Number.isInteger(+date.year) ? +date.year : DEFAULT_VALUE.year,
    month: Number.isInteger(+date.month)
      ? +date.month > 13
        ? 12
        : +date.month
      : DEFAULT_VALUE.month,
    day: Number.isInteger(+date.day)
      ? +date.day > 32
        ? 31
        : +date.day
      : DEFAULT_VALUE.day,
  };
};

export default DateModule;
