import * as React from "react";
import classes from "./StepsOverview.module.css";
import { ReactComponent as InfoSquareIcon } from "./../../icons/info-square.svg";
import { ReactComponent as TriangleIcon } from "./../../icons/triangle.svg";

const InfoMessage: React.FC<{ content: string }> = (props) => {
  return (
    <div
      className={classes["info-wrapper"]}
      onClick={(e) => e.stopPropagation()}
    >
      <span className={classes["info-content"]}> {props.content} </span>
      <InfoSquareIcon className={classes["info-icon"]} />
      <TriangleIcon className={classes["triangle-icon"]} />
    </div>
  );
};

export default InfoMessage;
