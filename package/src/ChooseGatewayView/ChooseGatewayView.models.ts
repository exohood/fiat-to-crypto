import { GatewayRateOption, GatewayRateOptionSimple } from "../ApiContext";

export interface IGatewayStats {
  [key: string]: {
    _id: number;
    noId: boolean;
    fast: boolean;
    cheapest: boolean;
    count: number;
  };
}

export type GateWayOptionProps = {
  index: number;
  isOpen: boolean;
  selectedReceivedCrypto?: number;
  stats?: IGatewayStats;
  onClick?: () => void;
} & GatewayRateOption;

export interface IRatesListProps {
  availableRates: GatewayRateOption[];
  unavailableRates: GatewayRateOption[];
  hiddenRates: GatewayRateOptionSimple[];
}

export enum BadgeType {
  Cheapest = "Cheapest",
  Fast = "Fast",
  NoIdRequired = "No ID",
}
