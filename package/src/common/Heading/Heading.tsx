import React from "react";
import classes from "./Heading.module.css";
import commonClasses from "../../styles.module.css";

const Heading: React.FC<{
  text?: string;
  textSubHeading?: string;
  className?: string;
  textAlign?: "left" | "right" | "center" | "justify";
}> = (props) => {
  return (
    <div
      className={`${classes["wrapper"]} ${props.className || ""}`}
      style={{ textAlign: props.textAlign || "center" }}
    >
      {!!props.text && (
        <h1 className={`${commonClasses["remove-default"]}`}>{props.text}</h1>
      )}

      {props.textSubHeading && (
        <h2 className={`${commonClasses["remove-default"]}`}>
          {props.textSubHeading}
        </h2>
      )}
    </div>
  );
};

export default Heading;
