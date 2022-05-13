// @flow
import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { CSSTransitionProps } from "react-transition-group/CSSTransition";
import styles from "./BaseInput.module.css";

const BaseInputTransition = React.forwardRef<
  HTMLDivElement,
  CSSTransitionProps
>((props, ref) => {
  return (
    <CSSTransition
      nodeRef={ref}
      in={props.in}
      timeout={500}
      classNames={{
        enter: styles["collapse-enter"],
        enterActive: styles["collapse-enter-active"],
        exit: styles["collapse-exit"],
        exitActive: styles["collapse-exit-active"],
      }}
      unmountOnExit={true}
    >
      {props.children}
    </CSSTransition>
  );
});

export default BaseInputTransition;
