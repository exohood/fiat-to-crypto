import React, { useState } from "react";
import styles from "./SearchInput.module.css";
import commonStyles from "./../../styles.module.css";
import searchIcon from "./../../icons/search.svg";
import { SearchInputProps } from "./SearchInput.models";

const SearchInput: React.FC<SearchInputProps> = (props: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`${styles["wrapper"]} ${
        isFocused ? styles["wrapper-focused"] : ""
      }`}
    >
      <div
        className={`${styles["search-icon-wrapper"]} ${commonStyles["flex-all"]}`}
      >
        <img src={searchIcon} alt="search-icon" />
      </div>
      <input
        className={styles["search-input"]}
        type="text"
        autoFocus={!!props.autoFocus}
        value={props.value}
        placeholder={props.placeholder || "Search..."}
        onChange={(e) => props.onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default SearchInput;
