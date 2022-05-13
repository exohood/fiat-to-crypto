import { ItemType } from "../../ApiContext";

export interface PaymentMethodPickerProps {
  items: ItemType[];
  selectedId: string;
  onChange: (item: ItemType) => void;
  openMoreOptions: (() => void) | undefined;
  isLoading?: boolean;
}
