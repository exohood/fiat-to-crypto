export type TabGroupProps = {
  items: string[];
  indexSelected: number;
  onClickItem: (index: number) => void;
};
