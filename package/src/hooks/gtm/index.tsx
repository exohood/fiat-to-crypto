import React, {
  ReactNode,
  createContext,
  useEffect,
  useContext,
  useReducer,
} from "react";
import { GtmParams, initGTM, sendToGTM } from "./GoogleTagManager";
import * as constants from "../../ApiContext/api/constants";

export type GTMProviderProps = {
  state?: GtmParams;
  children: ReactNode;
};

const initialState: GtmParams = {
  gtmId: "",
  dataLayer: undefined,
  dataLayerName: constants.DEFAULT_GTM_DATA_LAYER,
};

export const GTMContext = createContext<GtmParams | undefined>(initialState);
export const GTMContextDispatch = createContext<any | undefined>(undefined);

function dataReducer(state: GtmParams, data: any) {
  sendToGTM({ dataLayerName: state?.dataLayerName!, data });
  return state;
}

const GTMProvider: React.FC<GTMProviderProps> = ({ state, children }) => {
  const [store, dispatch] = useReducer(dataReducer, {
    ...initialState,
    ...state,
  });

  const mergedState = { ...store, ...state };

  useEffect(() => {
    initGTM({
      gtmId: mergedState.gtmId,
      dataLayer: mergedState.dataLayer,
      dataLayerName: mergedState.dataLayerName,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <GTMContext.Provider value={store}>
      <GTMContextDispatch.Provider value={dispatch}>
        {children}
      </GTMContextDispatch.Provider>
    </GTMContext.Provider>
  );
};

function useGTMDispatch() {
  const context = useContext(GTMContextDispatch);
  if (!context)
    throw new Error("dispatchGTMEvent must be used within a GTMProvider");

  return context;
}

export { GTMProvider, useGTMDispatch, sendToGTM };
