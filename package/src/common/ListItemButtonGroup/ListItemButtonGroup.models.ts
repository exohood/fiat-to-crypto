export type ListItemType = {
  id: string;
  icon: string;
  text: string;
  link?: string;
  items?: ListItemType[];
};

export type ListItemButtonGroupProps = {
  onClick?: (item: ListItemType) => void;
  items: ListItemType[];
  className?: string;
};
