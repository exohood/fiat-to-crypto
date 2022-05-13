import React, { useContext } from "react";
import classes from "./TabsHeader.module.css";
import headerClasses from "../Header.module.css";
import Menu from "../Menu/Menu";
import { NavContext } from "../../../NavContext";
import TabGroup from "../../TabGroup/TabGroup";
import iconMenu from "../../../icons/menu-var-2.svg";

export type ITabsHeaderProps = {
  onMenuClick?: () => void;
  tabs: string[];
  tabSelected: number;
  onClickItem: (index: number) => void;
};

const TabsHeader: React.FC<ITabsHeaderProps> = (props: ITabsHeaderProps) => {
  const { nextScreen } = useContext(NavContext);
  const {
    onMenuClick = () =>
      nextScreen(<Menu className={classes["tabs-header-menu"]} />),
  } = props;

  return (
    <nav className={classes.header}>
      <TabGroup
        items={props.tabs}
        indexSelected={props.tabSelected}
        onClickItem={props.onClickItem}
      />
      <img
        onClick={onMenuClick}
        alt="menu"
        className={`${headerClasses["header-burger-icon"]}`}
        src={iconMenu}
      />
    </nav>
  );
};

export default TabsHeader;
