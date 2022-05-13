import * as React from "react";
import classes from "./StepsOverview.module.css";
import commonClasses from "../.../../../styles.module.css";
import { OverviewStepSubItemProps } from "./StepsOverview.models";

const StepOverviewDetailItem: React.FC<OverviewStepSubItemProps> = (props) => {
  return (
    <div className={`${classes["sub-item"]} ${classes["border-left"]}`}>
      <div
        className={`${classes["sub-item-left"]} ${commonClasses["flex-all"]}`}
      >
        <i className={classes.dot} />
      </div>
      <span className={classes.content}>
        {props.content && props.content}
        {props.contentValues && (
          <>
            {props.contentValues.label}{" "}
            <span className={commonClasses["semibold"]}>
              {props.contentValues.value}
            </span>
          </>
        )}
      </span>
    </div>
  );
};

export default StepOverviewDetailItem;
