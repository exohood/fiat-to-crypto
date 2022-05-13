import { ItemType } from "../../ApiContext";
import { ViewListItemType } from "../ViewList/ViewList.models";

export type OverlayPickerProps = {
  title: string;
  items: ViewListItemType[];
  name?: string;
  indexSelected?: number;
  searchable?: boolean;
  onItemClick?: (listName: string, index: number, item: ItemType) => void;
};
