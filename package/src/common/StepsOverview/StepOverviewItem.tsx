import React, { useCallback, useState, useRef } from "react";
import classes from "./StepsOverview.module.css";
import commonClasses from "../.../../../styles.module.css";
import { StepOverviewItemProps } from "./StepsOverview.models";
import { CSSTransition } from "react-transition-group";
import InfoMessage from "./InfoMessage";
import StepOverviewDetailItem from "./StepOverviewDetailItem";
import { transitionClasses } from "./constants";
import { ReactComponent as ChevronRightIcon } from "./../../icons/chevron-right.svg";

const StepOverviewItem: React.FC<StepOverviewItemProps> = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const transitionRef = useRef<HTMLDivElement>(null);

  const onClick = () => {
    if (props.items?.length) {
      setIsExpanded(!isExpanded);
    }
    props.onClick && props.onClick();
  };

  const computeIsExpandable = useCallback(
    () => !!props.items?.length,
    [props.items?.length]
  );

  const computeMainItemClassName = useCallback(() => {
    const hasSvgIconClass =
      typeof props.icon !== "string" ? classes["wrapper-with-svg-icon"] : "";
    const singleChildClass = props.isSingleChild ? classes["single-child"] : "";
    const isExpandedClass = isExpanded ? classes["is-expanded"] : "";
    const className = props.className || "";

    return `${classes["item"]} ${classes["border-left"]} ${hasSvgIconClass} ${className} ${singleChildClass} ${isExpandedClass}`;
  }, [isExpanded, props.className, props.icon, props.isSingleChild]);

  const computeIconClassName = useCallback(() => {
    const isExpandableClass = computeIsExpandable()
      ? commonClasses["cursor-pointer"]
      : "";

    return `${classes["icon-wrapper"]} ${commonClasses["flex-all"]} ${isExpandableClass}`;
  }, [computeIsExpandable]);

  const isExpandable = computeIsExpandable();

  return (
    <React.Fragment>
      <li className={computeMainItemClassName()}>
        <div
          className={computeIconClassName()}
          itemProp="icon-wrapper"
          onClick={onClick}
        >
          {typeof props.icon === "string" ? (
            <img src={props.icon} alt="Icon item" itemProp="icon" />
          ) : (
            props.icon
          )}
        </div>

        <div
          className={`${classes.content} ${
            isExpandable ? commonClasses["cursor-pointer"] : ""
          }`}
          onClick={onClick}
        >
          <div className={classes.description}>{props.description}</div>
          <div className={classes.title}>{props.title}</div>

          {isExpandable && (
            <ChevronRightIcon
              className={`${classes["chevron"]} ${
                isExpanded ? classes["up"] : ""
              }`}
            />
          )}

          {props.info && <InfoMessage content={props.info} />}
        </div>
      </li>

      <CSSTransition
        nodeRef={transitionRef}
        in={isExpanded}
        timeout={500}
        classNames={transitionClasses}
        unmountOnExit
        onEnter={() => setIsExpanded(true)}
        onExited={() => setIsExpanded(false)}
      >
        <div ref={transitionRef} className={classes["details-container"]}>
          {props.items &&
            props.items.map((item, index) => (
              <StepOverviewDetailItem {...item} key={index} />
            ))}
        </div>
      </CSSTransition>
    </React.Fragment>
  );
};

export default StepOverviewItem;
