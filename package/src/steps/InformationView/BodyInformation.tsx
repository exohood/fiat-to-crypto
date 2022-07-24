import React from "react";
import stylesCommon from "../../styles.module.css";
import styles from "./styles.module.css";

type BodyInformationType = {
  message: string;
};

const BodyInformation: React.FC<BodyInformationType> = (props) => {
  return (
    <main className={`${stylesCommon.body} ${styles.body}`}>
      <p style={{ color: "#252525", fontSize: "0.9rem" }}>{props.message}</p>
    </main>
  );
};

export default BodyInformation;
