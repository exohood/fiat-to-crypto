import React, { useCallback, useState } from "react";
import styles from "./styles.module.css";
import { ItemType } from "../../ApiContext";

type ListProps = {
  items: ItemType[];
  onItemClick?: (index: number, item: ItemType) => void;
  searchable?: boolean;
};

const List: React.FC<ListProps> = (props) => {
  const { items, searchable = false } = props;
  const { onItemClick = () => null } = props;

  const handleItemClick = useCallback(
    (index: number, item: ItemType) => {
      onItemClick(index, item);
    },
    [onItemClick]
  );

  const [query, setQuery] = useState("");

  const filterItems = useCallback(
    (item: ItemType) => {
      const searchWords = item.searchWords?.replace(/[+/-]/g, " ");
      return (
        item.name
          .toLowerCase()
          .split(" ")
          .some((substring) => substring.toLowerCase().startsWith(query)) ||
        item.name.toLowerCase().toLowerCase().startsWith(query) ||
        item.info
          ?.split(" ")
          .some((substring) => substring.toLowerCase().startsWith(query)) ||
        item.info?.toLowerCase().startsWith(query) ||
        item.network?.toLowerCase().startsWith(query) ||
        searchWords
          ?.split(" ")
          .some((substring) => substring.toLowerCase().startsWith(query)) ||
        searchWords?.toLowerCase().startsWith(query)
      );
    },
    [query]
  );

  const smallHeightScreen =
    window.screen.height <= 615 || window.screen.width <= 575;

  return (
    <>
      {searchable && (
        <input
          className={styles["search-box"]}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value.toLowerCase())}
          placeholder="Search..."
          autoFocus={!smallHeightScreen}
        />
      )}
      <div className={`${styles.list}`}>
        {items.map(
          (item, i) =>
            filterItems(item) && (
              <ListItem
                id={item.id}
                key={i}
                index={i}
                name={item.name}
                info={item.info}
                icon={item.icon}
                network={item.network}
                onClick={() => handleItemClick(i, item)}
              />
            )
        )}
      </div>
    </>
  );
};

type ListItemProps = {
  index: number;
  onClick: (index: number) => void;
} & ItemType;

const ListItem: React.FC<ListItemProps> = (props) => {
  const { index, name, info, icon, network } = props;
  const { onClick = () => null } = props;
  return (
    <div className={`${styles["list-item"]}`} onClick={() => onClick(index)}>
      {icon && (
        <img
          alt="Icon"
          className={`${styles["list-item__child"]} ${styles["list-item__icon"]}`}
          src={icon}
        />
      )}
      <div className={styles["list-item__child"]}>
        <span>{name}</span>
        {info && <span className={`${styles["list-item__info"]}`}>{info}</span>}
        {network && (
          <div className={`${styles["list-item_network"]}`}>{network}</div>
        )}
      </div>
    </div>
  );
};

export default List;
