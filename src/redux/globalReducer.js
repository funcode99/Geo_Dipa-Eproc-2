import { persistReducer } from "redux-persist";
import { PERSIST_REDUCER } from "./BaseHost";

const globalRedTypes = {
  SET_LOADING: "SET_LOADING",
  SET_LOADING_DONE: "SET_LOADING_DONE",
};

const initialState = {
  loadings: [],
};

export const globalReducer = persistReducer(
  PERSIST_REDUCER,
  (state = initialState, action) => {
    switch (action.type) {
      case globalRedTypes.SET_LOADING:
        return {
          ...state,
          loadings: [...state.loadings, action.payload],
        };
      case globalRedTypes.SET_LOADING_DONE:
        return {
          ...state,
          loadings: state.loadings.filter((item) => item !== action.payload),
        };
      default:
        return state;
    }
  }
);

// actions below
export const set_loading_rd = (payload) => ({
  type: globalRedTypes.SET_LOADING,
  payload,
});
export const set_loading_done_rd = (payload) => ({
  type: globalRedTypes.SET_LOADING_DONE,
  payload,
});

// selectors below
export const getLoading = (state, key) => {
  const { loadings } = state.globalReducer;
  const loadState = loadings.includes(key);
  return loadState;
};
