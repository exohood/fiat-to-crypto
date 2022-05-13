import React from "react";
import styles from "./Loader.module.css";

const Loader: React.FC<{ className?: string }> = (props) => {
  return (
    <div className={`${styles["wrapper"]} ${props.className || ""}`}>
      <div className={styles["sub-wrapper"]}>
        <div className={`${styles["ball"]} ${styles["ball1"]}`}></div>
        <div className={`${styles["ball"]} ${styles["ball2"]}`}></div>
        <div className={`${styles["ball"]} ${styles["ball3"]}`}></div>
      </div>
    </div>
  );
};

export default Loader;
