import React from "react";
import { useTranslation } from "react-i18next";
import ListItemButtonGroup from "../../ListItemButtonGroup/ListItemButtonGroup";
import OverlayMenu from "../../OverlayMeu/OverlayMenu";
import menuItems from "./menuItems";
import classes from "./Menu.module.css";
import { ListItemType } from "../../ListItemButtonGroup/ListItemButtonGroup.models";
import { useGTMDispatch } from "../../../hooks/gtm";
import {
  GtmEvent,
  GtmEventAction,
  GtmEventCategory,
  GtmEventLabel,
  MenuItemLabel,
} from "../../../enums";

const Menu: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
  const sendDataToGTM = useGTMDispatch();

  const handleSendMenuDataToGTM = (item: ListItemType) => {
    const gtmData = {
      event: GtmEvent.ELEMENT_CLICK,
      action: GtmEventAction.MENU,
      category: GtmEventCategory.LINK,
      label: MenuItemLabel[item.id as keyof typeof MenuItemLabel],
    };
    sendDataToGTM(gtmData);
  };

  const handleSendMenuCloseToGTM = () => {
    const gtmData = {
      event: GtmEvent.ELEMENT_CLICK,
      action: GtmEventAction.MENU_CLOSE,
      category: GtmEventCategory.LINK,
      label: GtmEventLabel.MENU_CLOSE,
    };
    sendDataToGTM(gtmData);
  };

  return (
    <OverlayMenu
      headerProps={{
        title: t("menu.title"),
        className: props.className,
      }}
      onClose={handleSendMenuCloseToGTM}
    >
      <ListItemButtonGroup
        className={classes["menu-list"]}
        items={menuItems}
        onClick={handleSendMenuDataToGTM}
      />
    </OverlayMenu>
  );
};

export default Menu;
