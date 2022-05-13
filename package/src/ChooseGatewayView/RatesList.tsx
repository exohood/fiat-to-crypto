import React, { useContext, useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";
import GatewayOption from "./GatewayOption";
import type {
  IGatewayStats,
  IRatesListProps,
} from "./ChooseGatewayView.models";
import { APIContext, GatewayRateOption } from "../ApiContext";
import { documents } from "../ApiContext/api/constants";
import { getArrOfMinsMaxs } from "../utils";

const RatesList: React.FC<IRatesListProps> = (props) => {
  const {
    collected,
    inputInterface: { handleInputChange },
  } = useContext(APIContext);
  const [sortedAvailableRates, setSortedAvailableRates] = useState<
    GatewayRateOption[]
  >([]);

  const getDefaultReceivedCrypto = useCallback(() => {
    return collected.amountInCrypto
      ? Number.NEGATIVE_INFINITY
      : Number.POSITIVE_INFINITY;
  }, [collected.amountInCrypto]);

  const getStats = useCallback(() => {
    const requiresPaperIdMap = props.availableRates.reduce((acc, rate) => {
      const hasNoId = (rate.requiredKYC ?? []).some((kyc) => {
        if (typeof kyc === "string") {
          return documents.some((doc) => doc === kyc);
        }

        return kyc.some((kycItem) => documents.some((doc) => doc === kycItem));
      });

      return {
        ...acc,
        [rate.identifier]: hasNoId,
      };
    }, {} as { [key: string]: boolean });

    const defaultReceivedCrypto = getDefaultReceivedCrypto();
    const cheapest = getArrOfMinsMaxs(
      props.availableRates.map((rate) => ({
        name: rate.identifier,
        value: rate.receivedCrypto ?? defaultReceivedCrypto,
      })),
      collected.amountInCrypto ?? false
    );

    return props.availableRates.reduce<IGatewayStats>((acc, rate, index) => {
      const allbadges = {
        _id: index,
        noId: !requiresPaperIdMap[rate.identifier],
        fast: rate.duration.seconds <= 60 * 10,
        cheapest: cheapest.some((id) => id === rate.identifier),
      };
      return {
        ...acc,
        [rate.identifier]: {
          ...allbadges,
          count: Object.values(allbadges).filter(Boolean).length,
        },
      };
    }, {});
  }, [
    collected.amountInCrypto,
    getDefaultReceivedCrypto,
    props.availableRates,
  ]);

  const [stats, setStats] = useState(getStats());

  const setSelectedGateway = useCallback(
    (item: GatewayRateOption) => {
      handleInputChange("selectedGateway", item);
    },
    [handleInputChange]
  );

  useEffect(() => {
    const defaultReceivedCrypto = getDefaultReceivedCrypto();
    const sortedItems = [...props.availableRates].sort((a, b) => {
      let res = 0;
      if (res === 0)
        res =
          ((b.receivedCrypto ?? defaultReceivedCrypto) -
            (a.receivedCrypto ?? defaultReceivedCrypto)) *
          (collected.amountInCrypto ? -1 : 1);
      if (res === 0) res = a.duration.seconds - b.duration.seconds;
      return res;
    });

    setSortedAvailableRates(sortedItems);
  }, [
    collected.amountInCrypto,
    getDefaultReceivedCrypto,
    props.availableRates,
  ]);

  useEffect(() => {
    setStats(getStats);
  }, [getStats]);

  const unavailableRates: GatewayRateOption[] = props.unavailableRates;
  const _unavailableRates = unavailableRates.filter(
    (ur) => !ur.error?.type.match(/MIN|MAX/)
  );
  const _minMaxUnavailableRates = unavailableRates.filter((ur) =>
    ur.error?.type.match(/MIN|MAX/)
  );

  return (
    <ul className={`${styles["rates-list"]}`}>
      {sortedAvailableRates.map((item, i) => (
        <GatewayOption
          key={i}
          index={i}
          isOpen={item.id === collected.selectedGateway?.id}
          selectedReceivedCrypto={collected.selectedGateway?.receivedCrypto}
          onClick={() => setSelectedGateway(item)}
          stats={stats}
          {...item}
        />
      ))}
      {_minMaxUnavailableRates.map((item, i) => (
        <GatewayOption
          key={i}
          index={i}
          isOpen={false}
          selectedReceivedCrypto={0}
          {...item}
        />
      ))}
      {props.hiddenRates.map((item, i) => (
        <GatewayOption
          id={item.identifier}
          name={item.identifier}
          available={false}
          duration={{ seconds: 0, message: "" }}
          key={i}
          index={i}
          isOpen={false}
          selectedReceivedCrypto={0}
          {...item}
        />
      ))}
      {_unavailableRates.map((item, i) => (
        <GatewayOption
          key={i}
          index={i}
          isOpen={false}
          selectedReceivedCrypto={0}
          {...item}
        />
      ))}
    </ul>
  );
};

export default RatesList;
