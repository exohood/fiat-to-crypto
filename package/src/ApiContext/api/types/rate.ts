import { NextStep } from "./nextStep";

interface GatewayRate {
  identifier: string;
  duration: {
    seconds: number;
    message: string;
  };
  available: boolean;
  rate?: number;
  fees?: number;
  requiredKYC?: (string | string[])[];
  receivedCrypto?: number;
  nextStep?: NextStep;
  error?: {
    type: string;
    message: string;
    limit?: number;
  };
  icon?: string;
}

type RateResponse = GatewayRate[];

export type { RateResponse, GatewayRate };
