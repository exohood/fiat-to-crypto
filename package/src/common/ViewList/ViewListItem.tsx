import React from "react";
import styles from "./ViewList.module.css";
import { ViewListItemProps } from "./ViewList.models";

const ListItem: React.FC<ViewListItemProps> = (props: ViewListItemProps) => {
  return (
    <li
      className={`${props.isSelected ? styles["selected"] : ""}`}
      onClick={() => props.onClick(props.index)}
    >
      {!props.iconSvg && props.icon && (
        <img alt="Icon" className={styles["list-item-icon"]} src={props.icon} />
      )}
      {props.iconSvg && <> {props.iconSvg} </>}

      <div className={styles["list-item-child"]}>
        <div className={styles["list-item-name"]}> {props.name} </div>
        {props.info && (
          <div className={`${styles["list-item-info"]}`}> {props.info} </div>
        )}
      </div>

      {props.rightSection && <> {props.rightSection} </>}
    </li>
  );
};

export default ListItem;
