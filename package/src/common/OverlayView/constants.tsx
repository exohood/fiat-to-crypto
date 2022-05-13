export const defaultAnimTimeout = 250;
export const defaultMaxHeight = "462px";

export const getTransitionClasses = (
  styles: {
    [className: string]: string;
  },
  classPrefix: string
) => ({
  enter: styles["collapse-enter" + classPrefix],
  enterActive: styles["collapse-enter-active" + classPrefix],
  exit: styles["collapse-exit" + classPrefix],
  exitActive: styles["collapse-exit-active" + classPrefix],
});
