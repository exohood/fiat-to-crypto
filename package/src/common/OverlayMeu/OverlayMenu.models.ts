import { HeaderMenuProps } from "./HeaderMenu/HeaderMenu.models";

export type OverlayMenuProps = {
  headerProps?: Omit<HeaderMenuProps, "handleDismiss">;
};
