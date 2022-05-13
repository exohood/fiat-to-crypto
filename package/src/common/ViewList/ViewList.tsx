import React, { useCallback, useState } from "react";
import styles from "./ViewList.module.css";
import { ViewListItemType, ViewListProps } from "./ViewList.models";
import ListItem from "./ViewListItem";
import SearchInput from "../SearchInput/SearchInput";

const determineIsSmallScreen = () =>
  window.screen.height <= 615 || window.screen.width <= 575;

const ViewList: React.FC<ViewListProps> = (props: ViewListProps) => {
  const { onItemClick = () => null } = props;

  const [isSmallHeightScreen] = useState(determineIsSmallScreen());
  const [query, setQuery] = useState("");
  const [indexSelected, setIndexSelected] = useState(props.indexSelected);

  const handleItemClick = useCallback(
    (index: number, item: ViewListItemType) => {
      setIndexSelected(index);
      onItemClick(index, item);
    },
    [onItemClick]
  );

  const itemIsVisible = useCallback(
    (item: ViewListItemType) => {
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

  return (
    <>
      {props.searchable && (
        <div className={styles["input-wrapper"]}>
          <SearchInput
            value={query}
            onChange={(value) => setQuery(value.toLowerCase())}
            autoFocus={!isSmallHeightScreen}
          />
        </div>
      )}
      <ul className={`${styles.list}`}>
        {props.items.map(
          (item, i) =>
            itemIsVisible(item) && (
              <ListItem
                id={item.id}
                key={i}
                index={i}
                name={item.name}
                info={item.info}
                icon={item.icon}
                iconSvg={item.iconSvg}
                network={item.network}
                onClick={() => handleItemClick(i, item)}
                isSelected={indexSelected === i}
                rightSection={item.rightSection}
              />
            )
        )}
      </ul>
    </>
  );
};

export default ViewList;
