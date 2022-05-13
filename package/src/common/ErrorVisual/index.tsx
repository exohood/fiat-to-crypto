import React from "react";
import styles from "./styles.module.css";

import LogoOnramper from "../../icons/onramper_logo.svg";

const ErrorVisual: React.FC<{ message?: string; className?: string }> = ({
  message,
}) => {
  return (
    <div className={styles.container}>
      {false && <img alt="Error" src={LogoOnramper} />}
      {message && <span>{message}</span>}
    </div>
  );
};

export default ErrorVisual;
