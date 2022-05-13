import React from "react";
import { useTranslation } from "react-i18next";
import ListItemButtonGroup from "../../ListItemButtonGroup/ListItemButtonGroup";
import OverlayMenu from "../../OverlayMeu/OverlayMenu";
import menuItems from "./menuItems";
import classes from "./Menu.module.css";

const Menu: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();

  return (
    <OverlayMenu
      headerProps={{
        title: t("menu.title"),
        className: props.className,
      }}
    >
      <ListItemButtonGroup className={classes["menu-list"]} items={menuItems} />
    </OverlayMenu>
  );
};

export default Menu;
