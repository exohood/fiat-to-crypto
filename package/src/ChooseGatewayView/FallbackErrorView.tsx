import React from "react";
import stylesCommon from "../styles.module.css";
import InfoBox from "../common/InfoBox";

const FallbackErrorView: React.FC = () => (
  <main className={stylesCommon.body}>
    <InfoBox in={true} type="info" className={`${stylesCommon.body__child}`}>
      No prices available at this time.
    </InfoBox>
  </main>
);

export default FallbackErrorView;
