import { ItemType } from "../../ApiContext";
import { ReactNode } from "react";

export type ViewListItemType = {
  rightSection?: ReactNode;
} & ItemType;

export type ViewListItemProps = {
  index: number;
  onClick: (index: number) => void;
  isSelected?: boolean;
} & ItemType &
  ViewListItemType;

export type ViewListProps = {
  items: ViewListItemType[];
  onItemClick?: (index: number, item: ItemType) => void;
  searchable?: boolean;
  indexSelected?: number;
};
