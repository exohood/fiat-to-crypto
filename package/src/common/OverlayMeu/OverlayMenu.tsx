import React, { useContext, useEffect, useState } from "react";
import { OverlayMenuProps } from "./OverlayMenu.models";
import classes from "./OverlayMenu.module.css";
import commonClasses from "./../../styles.module.css";
import { NavContext } from "../../NavContext";
import { CSSTransition } from "react-transition-group";
import { transitionTimeout, getTransitionClasses } from "./constants";
import HeaderMenu from "./HeaderMenu/HeaderMenu";

const OverlayMenu: React.FC<OverlayMenuProps> = (props) => {
  const transitionRef = React.useRef(null);
  const { backScreen } = useContext(NavContext);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleDismiss = () => {
    setIsActive((oldValue) => !oldValue);
    setTimeout(backScreen, transitionTimeout);
  };

  return (
    <div
      className={`${commonClasses.view} ${classes["wrapper-view"]}`}
      onClick={handleDismiss}
    >
      <CSSTransition
        nodeRef={transitionRef}
        in={isActive}
        timeout={transitionTimeout}
        classNames={getTransitionClasses(classes)}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <div
          className={classes["wrapper"]}
          ref={transitionRef}
          onClick={(e) => e.stopPropagation()}
        >
          {props.headerProps && (
            <HeaderMenu {...props.headerProps} handleDismiss={handleDismiss} />
          )}
          {props.children}
        </div>
      </CSSTransition>
    </div>
  );
};

export default OverlayMenu;
