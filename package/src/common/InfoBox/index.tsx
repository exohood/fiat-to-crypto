import React, { useState, useEffect, useContext } from "react";
import styles from "./styles.module.css";
import { CSSTransition } from "react-transition-group";
import ButtonAction from "../ButtonAction";
import { APIContext } from "../../ApiContext";
import { URLize } from "./utils";

type InfoBoxType = {
  type?: "info" | "error" | "notification";
  onDismissClick?: () => void;
  canBeDismissed?: boolean;
  in: boolean;
  className?: string;
  onActionClick?: () => void;
  actionText?: string;
  message?: string;
  focus?: boolean;
};

const InfoBox = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<InfoBoxType>
>((props, ref) => {
  const [disableButton, setDisableButton] = useState(false);
  const { collected } = useContext(APIContext);

  const {
    type = "info",
    onDismissClick = () => null,
    canBeDismissed = false,
    className = "",
    actionText = "See more",
  } = props;
  const defaultRef = ref || React.createRef<HTMLDivElement>();
  let classBoxType = "";
  switch (type) {
    case "error":
      classBoxType = "infobox--error";
      break;
    case "notification":
      classBoxType = "infobox--notification";
      break;
    case "info":
    default:
      classBoxType = "infobox--info";
      break;
  }

  //const main = window.document.getElementById('main')
  const primaryColor = collected.themeColor; //main !== null ? getComputedStyle(main).getPropertyValue('--primary-color').replace('#', '') : undefined

  const style = {
    "--color-border": "var(--primary-color)",
    "--color-background": `#${primaryColor}15`,
  } as React.CSSProperties;

  const _onActionClick = () => {
    setDisableButton(true);
    if (props.onActionClick) {
      props.onActionClick();
    }
  };

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (disableButton)
      t = setTimeout(() => {
        setDisableButton(false);
      }, 1000);
    return () => clearTimeout(t);
  }, [disableButton]);

  const message = URLize(props.message);

  useEffect(() => {
    if (
      defaultRef &&
      "current" in defaultRef &&
      defaultRef.current &&
      props.focus
    ) {
      defaultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [defaultRef, props.focus]);

  return (
    <CSSTransition
      nodeRef={defaultRef}
      in={props.in}
      timeout={{
        enter: 100,
        exit: 0,
      }}
      classNames={{
        enter: styles["collapse-enter"],
        enterActive: styles["collapse-enter-active"],
      }}
      unmountOnExit={true}
    >
      <div
        style={style}
        ref={defaultRef}
        className={`${styles.infobox} ${
          !props.children ? styles["infobox-simple"] : ""
        } ${styles[classBoxType]} ${className}`}
      >
        {typeof message === "string" && props.message && (
          <>
            <span className={styles.text}>{message}</span>
            <br />
          </>
        )}
        <div
          className={`${styles["child-node"]} ${
            !props.children ? styles["child-node-simple"] : ""
          }`}
        >
          {props.message && typeof message !== "string" ? (
            <span className={styles.text}>{message}</span>
          ) : (
            <span className={styles.text}>{props.children}</span>
          )}
          {props.onActionClick && (
            <span
              style={{
                fontSize: "0.7rem",
                marginRight: canBeDismissed ? "0.75rem" : "unset",
              }}
            >
              <ButtonAction
                className={`${styles["button-action"]}`}
                size="small"
                text={disableButton ? "Loading..." : actionText}
                onClick={_onActionClick} /* disabled={disableButton} */
              />
            </span>
          )}
        </div>
        {canBeDismissed && (
          <span className={styles["close-button"]} onClick={onDismissClick}>
            ✖
          </span>
        )}
      </div>
    </CSSTransition>
  );
});

export default InfoBox;
