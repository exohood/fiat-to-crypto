import React from "react";
import { HeaderMenuProps } from "./HeaderMenu.models";
import classes from "./HeaderMenu.module.css";
import menuCloseIcon from "./../../../icons/menu-close.svg";

const HeaderMenu: React.FC<HeaderMenuProps> = (props) => {
  return (
    <nav className={`${classes["wrapper"]} ${props.className || ""}`}>
      <div itemProp="text" className={classes["text"]}>
        {props.title}
      </div>
      <img src={menuCloseIcon} onClick={props.handleDismiss} />
    </nav>
  );
};

export default HeaderMenu;
