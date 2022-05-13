export type DropdownHandleProps = {
  icon: string | undefined;
  value: string;
  className?: string;
  iconClassname?: string;
  disabled?: boolean;
  onClick: (value: string) => void;
};
