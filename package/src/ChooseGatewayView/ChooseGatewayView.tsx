import React, { useContext, useState, useEffect } from "react";
import stylesCommon from "../styles.module.css";
import styles from "./styles.module.css";
import { APIContext, GatewayRateOption } from "../ApiContext";
import OverlayView from "../common/OverlayView/OverlayView";
import FallbackErrorView from "./FallbackErrorView";
import InfoBox from "../common/InfoBox";
import RatesList from "./RatesList";
import { cryptoAmountsWarning } from "./constants";

const ChooseGatewayView = () => {
  const { data } = useContext(APIContext);
  const [availableRates, setAvailableRates] = useState<GatewayRateOption[]>([]);
  const [unavailableRates, setUnavailableRates] = useState<GatewayRateOption[]>(
    []
  );

  useEffect(() => {
    const availableRates = data.allRates.filter((g) => g.available);
    setAvailableRates(availableRates);

    const unavailableRates = data.allRates.filter((el) => !el.available);
    setUnavailableRates(unavailableRates);
  }, [data.allRates]);

  return (
    <OverlayView title="Choose seller">
      {data.allRates.length === 0 && <FallbackErrorView />}

      {data.allRates.length > 0 && (
        <main className={`${stylesCommon.body} ${styles.body}`}>
          <InfoBox
            in={true}
            type="notification"
            className={`${stylesCommon.body__child}`}
          >
            {cryptoAmountsWarning}
          </InfoBox>
          <div className={`${stylesCommon.body__child}`}>
            <RatesList
              availableRates={availableRates}
              unavailableRates={unavailableRates}
              hiddenRates={data.mappedHiddenByFiat}
            />
          </div>
        </main>
      )}
    </OverlayView>
  );
};

export default ChooseGatewayView;
