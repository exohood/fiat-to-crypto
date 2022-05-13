import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import commonStyles from "../../styles.module.css";

import { NavContext } from "../../NavContext";
import { CSSTransition } from "react-transition-group";
import ButtonAction from "../ButtonAction";
import Footer from "../Footer";

interface HelpViewProps {
  buttonText?: string;
  maxHeight?: string;
  fixedHeight?: boolean;
  onActionClick?: () => Promise<boolean>;
  error?: string;
  dismissAfterClick?: boolean;
  noFooter?: boolean;
}

const HelpView: React.FC<HelpViewProps> = (props) => {
  const transitionRef = React.useRef(null);
  const { backScreen } = useContext(NavContext);

  const [isActive, setIsActive] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const {
    maxHeight = "388px",
    fixedHeight = false,
    dismissAfterClick = false,
  } = props;
  const classPrefix = fixedHeight ? "--fixed" : "";

  const ANIMATION_TIMEOUT = 250;

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleDismiss = () => {
    setIsActive((oldValue) => !oldValue);
    setTimeout(backScreen, ANIMATION_TIMEOUT);
  };

  const handleOnButtonClick = async () => {
    setButtonDisabled(true);
    if (props.error || (await props.onActionClick?.())) {
      setButtonDisabled(false);
    }
    if (dismissAfterClick) handleDismiss();
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
        timeout={ANIMATION_TIMEOUT}
        classNames={{
          enter: styles["collapse-enter" + classPrefix],
          enterActive: styles["collapse-enter-active" + classPrefix],
          exit: styles["collapse-exit" + classPrefix],
          exitActive: styles["collapse-exit-active" + classPrefix],
        }}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        <div
          ref={transitionRef}
          style={style}
          onClick={(e) => e.stopPropagation()}
          className={`${commonStyles.body} ${styles["help-pane"]} ${
            styles["help-pane" + classPrefix]
          }`}
        >
          {props.children}
          {props.buttonText && (
            <ButtonAction
              onClick={props.error ? handleDismiss : handleOnButtonClick}
              text={props.buttonText}
              disabled={buttonDisabled}
            />
          )}
          {!props.noFooter && <Footer />}
        </div>
      </CSSTransition>
    </div>
  );
};

export default HelpView;
