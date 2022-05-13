export type InputButtonProps = {
  selectedOption: string;
  label?: string;
  icon?: string;
  className?: string;
  iconPosition?: "start" | "end";
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  renderIconSvg?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  error?: string;
  onHelpClick?: () => void;
  hint?: string;
  network?: string;
};
