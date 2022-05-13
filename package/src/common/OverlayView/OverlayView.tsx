import React, { useContext, useEffect, useState } from "react";
import styles from "./OverlayView.module.css";
import commonStyles from "../../styles.module.css";
import { NavContext } from "../../NavContext";
import { CSSTransition } from "react-transition-group";
import { IOverlayViewProps } from "./OverlayView.models";
import {
  defaultMaxHeight,
  defaultAnimTimeout,
  getTransitionClasses,
} from "./constants";
import OverlayHeader from "./OverlayHeader/OverlayHeader";

const OverlayView: React.FC<IOverlayViewProps> = (props) => {
  const transitionRef = React.useRef(null);
  const { backScreen } = useContext(NavContext);
  const [isActive, setIsActive] = useState(false);

  const { maxHeight = defaultMaxHeight, fixedHeight = false } = props;
  const classPrefix = fixedHeight ? "-fixed" : "";

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleDismiss = () => {
    setIsActive((oldValue) => !oldValue);
    setTimeout(backScreen, defaultAnimTimeout);
  };

  const style = {
    "--pane-max-height": maxHeight,
  } as React.CSSProperties;

  return (
    <div
      className={`${commonStyles.view} ${styles["help-view"]}`}
      onClick={handleDismiss}
    >
      <CSSTransition
        nodeRef={transitionRef}
        in={isActive}
        timeout={defaultAnimTimeout}
        classNames={getTransitionClasses(styles, classPrefix)}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <div
          ref={transitionRef}
          style={style}
          onClick={(e) => e.stopPropagation()}
          className={`${styles["help-pane"]} ${
            styles["help-pane" + classPrefix]
          }`}
        >
          {props.title && (
            <OverlayHeader text={props.title} close={handleDismiss} />
          )}
          {props.children}
        </div>
      </CSSTransition>
    </div>
  );
};

export default OverlayView;
