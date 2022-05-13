export const transitionTimeout = 300;
export const getTransitionClasses = (classes: {
  [className: string]: string;
}) => ({
  enter: classes["collapse-enter"],
  enterActive: classes["collapse-enter-active"],
  exit: classes["collapse-exit"],
  exitActive: classes["collapse-exit-active"],
});
