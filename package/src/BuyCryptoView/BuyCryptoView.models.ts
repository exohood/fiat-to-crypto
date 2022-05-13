import { ItemType } from "../ApiContext";

export interface IBodyBuyCryptoProps {
  onBuyCrypto: () => void;
  selectedCrypto?: ItemType;
  selectedCurrency?: ItemType;
  selectedPaymentMethod?: ItemType;
  handleInputChange: (name: string, value: any) => void;
  isFilled?: boolean;
  handlePaymentMethodChange: (item: ItemType) => void;
  initLoadingFinished: boolean;
}
