import { ListItemType } from "../ListItemButtonGroup.models";

export type ListItemButtonChildProps = {
  id: string;
  text: string;
  icon: string;
  link?: string;
  className?: string;
  hasChildren?: boolean;
  childrenVisible?: boolean;
  onClick: () => void;
};

export type ListItemButtonProps = {
  parent: ListItemType;
  onClick: (item: ListItemType) => void;
};
