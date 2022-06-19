import React, { createContext, useReducer, useCallback } from "react";
import styles from "./styles.module.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ChatBubble from "./ChatBubble";
import { APIContext } from "../ApiContext";

export type ScreenType = React.ReactNode;

export type NavigationStateType = {
  screens: ScreenType[];
  currentSes: number;
  isChatOpen: boolean;
};

export enum NavigationActionsType {
  Only = "ONLY",
  Push = "PUSH",
  Pop = "POP",
  Replace = "REPLACE",
  Chat = "TRIGGERCHAT",
}

export type NavigationActions =
  | {
      type: NavigationActionsType.Only;
      screen: ScreenType;
    }
  | {
      type: NavigationActionsType.Push;
      screen: ScreenType;
    }
  | {
      type: NavigationActionsType.Pop;
    }
  | {
      type: NavigationActionsType.Replace;
      screen: ScreenType;
    }
  | {
      type: NavigationActionsType.Chat;
    };

const initialState = {
  screens: [],
  currentSes: 0,
  isChatOpen: false,
};

//Creating context
const NavContext = createContext<{
  _state: NavigationStateType;
  onlyScreen: (screen: ScreenType) => void;
  backScreen: () => void;
  nextScreen: (screen: ScreenType) => void;
  replaceScreen: (screen: ScreenType) => void;
  triggerChat: () => void;
  currentStep: () => number;
}>({
  _state: initialState,
  onlyScreen: () => null,
  backScreen: () => null,
  nextScreen: () => null,
  replaceScreen: () => null,
  triggerChat: () => null,
  currentStep: () => 0,
});

//Creating context
const NavProvider: React.FC = (props) => {
  const [_state, dispatch] = useReducer(mainReducer, initialState);

  const backScreen = useCallback(
    () => dispatch({ type: NavigationActionsType.Pop }),
    []
  );
  const nextScreen = useCallback(
    (screen: ScreenType) =>
      dispatch({ type: NavigationActionsType.Push, screen }),
    []
  );
  const onlyScreen = useCallback(
    (screen: ScreenType) =>
      dispatch({ type: NavigationActionsType.Only, screen }),
    []
  );
  const replaceScreen = useCallback(
    (screen: ScreenType) =>
      dispatch({ type: NavigationActionsType.Replace, screen }),
    []
  );
  const triggerChat = useCallback(
    () => dispatch({ type: NavigationActionsType.Chat }),
    []
  );

  const currentStep = useCallback(
    () => _state.screens.length - 1,
    [_state.screens]
  );

  return (
    <NavContext.Provider
      value={{
        _state,
        onlyScreen,
        backScreen,
        nextScreen,
        replaceScreen,
        triggerChat,
        currentStep,
      }}
    >
      {props.children}
    </NavContext.Provider>
  );
};

class NavContainer extends React.Component<
  { home?: ScreenType },
  { intro: boolean }
> {
  private transitionRef: React.RefObject<any>;
  private timer: ReturnType<typeof setTimeout> | null;

  constructor(props: { home?: ScreenType }) {
    super(props);

    this.state = {
      intro: false,
    };
    this.transitionRef = React.createRef();
    this.timer = null;
  }

  componentDidMount() {
    const firstScreen = this.props.home;
    if (firstScreen) this.context.onlyScreen(firstScreen);

    this.timer = setTimeout(() => {
      this.setState({ intro: true });
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.setState({ intro: false });
        if (this.timer) clearTimeout(this.timer);
      }, 800);
    }, 900);
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  render() {
    return (
      <APIContext.Consumer>
        {(apicontext) => {
          return (
            <NavContext.Consumer>
              {(value) => (
                <div className={styles["nav-container"]}>
                  <TransitionGroup>
                    {value._state.screens.map((screen, i) => (
                      <CSSTransition
                        key={i}
                        nodeRef={this.transitionRef}
                        timeout={200}
                        classNames={{
                          enter: styles["screen-enter"],
                          enterActive: styles["screen-enter-active"],
                          exit: styles["screen-exit"],
                          exitActive: styles["screen-exit-active"],
                        }}
                      >
                        <div
                          key={`${value._state.currentSes}${i}`}
                          style={{ zIndex: i + 1 }}
                          className={styles.screen}
                          ref={this.transitionRef}
                        >
                          {screen}
                        </div>
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                  {value._state.isChatOpen && (
                    <ChatBubble
                      onActionChatClick={() => {
                        value.triggerChat();
                      }}
                      isChatOpen={value._state.isChatOpen}
                      intro={this.state.intro}
                      isBubbleActive={apicontext.collected.displayChatBubble}
                    />
                  )}
                </div>
              )}
            </NavContext.Consumer>
          );
        }}
      </APIContext.Consumer>
    );
  }
}

NavContainer.contextType = NavContext;

const mainReducer = (
  state: NavigationStateType,
  action: NavigationActions
) => ({
  screens: navigationReducer(state, action),
  currentSes:
    action.type === NavigationActionsType.Only
      ? state.currentSes + 1
      : state.currentSes,
  isChatOpen:
    action.type === NavigationActionsType.Chat
      ? !state.isChatOpen
      : state.isChatOpen,
});

const navigationReducer = (
  state: NavigationStateType,
  action: NavigationActions
) => {
  const { screens } = state;
  switch (action.type) {
    case NavigationActionsType.Only:
      return [action.screen];
    case NavigationActionsType.Push:
      return [...screens, action.screen];
    case NavigationActionsType.Pop:
      if (screens.length <= 1) return screens;
      return [...screens.slice(0, -1)];
    case NavigationActionsType.Replace:
      return [...screens.slice(0, -1), action.screen];
    default:
      return screens;
  }
};

export { NavProvider, NavContext, NavContainer };
