import React from "react";
import styles from "./styles.module.css";

const Loading = () => {
  return (
    <>
      <div className={styles["load"]}>
        <div className={styles["line"]}></div>
        <div className={styles["line"]}></div>
        <div className={styles["line"]}></div>
      </div>
    </>
  );
};

export default Loading;
