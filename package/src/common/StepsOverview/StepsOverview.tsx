import * as React from "react";
import classes from "./StepsOverview.module.css";
import { StepsOverviewProps } from "./StepsOverview.models";
import StepOverviewItem from "./StepOverviewItem";
import { styleVariables } from "./constants";

const StepsOverview: React.FC<StepsOverviewProps> = (props) => {
  const [style, setStyle] = React.useState<React.CSSProperties>(
    styleVariables?.[props.variant || "default"]
  );

  React.useEffect(() => {
    setStyle(styleVariables?.[props.variant || "default"]);
  }, [props.variant]);

  return (
    <ul
      style={style}
      className={`${classes["wrapper"]} ${props.className || ""}`}
    >
      {props.items.map((step, index) => (
        <StepOverviewItem
          {...step}
          key={index}
          isSingleChild={props.items.length === 1}
          onClick={() => {
            props.onClickItem && props.onClickItem(index);
          }}
        />
      ))}
    </ul>
  );
};

export default StepsOverview;
