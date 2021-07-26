import { persistReducer } from "redux-persist";
import { call, delay, put, takeEvery } from "redux-saga/effects";
import apiHelper from "../app/service/helper/apiHelper";
import { MODAL } from "../service/modalSession/ModalService";
import { PERSIST_REDUCER } from "./BaseHost";

const globalRedTypes = {
  SET_LOADING: "SET_LOADING",
  SET_LOADING_DONE: "SET_LOADING_DONE",
  FETCH_API_SAGA: "FETCH_API_SAGA",
};

const initialState = {
  loadings: [],
};

export const reducer = persistReducer(
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
export const fetch_api_sg = (payload) => ({
  type: globalRedTypes.FETCH_API_SAGA,
  payload,
});

// selectors below
export const getLoading = (state, key) => {
  const { loadings } = state.globalReducer;
  const loadState = loadings.includes(key);
  return loadState;
};

// sagas below
/**
 * key:required
  type: required
  url: required
  alertAppear: optional , default error only
  params: optional
  onSuccess: optional,
  onFail: optional
 */
export function* saga() {
  yield takeEvery(globalRedTypes.FETCH_API_SAGA, function* fetchApi(action) {
    const { key, onSuccess, onFail, alertAppear = false } = action.payload;
    if (key) yield put(set_loading_rd(key));
    try {
      let { data } = yield call(apiHelper.fetchGlobalApi, action.payload);
      // let data = yield call(apiHelper.fetchGlobalApi, action.payload);
      console.log(`resnew + ${key}`, data);
      if (data.status === true) {
        if (typeof onSuccess === "function") onSuccess(data);
        if (alertAppear === "both")
          MODAL.showSnackbar(data?.message ?? "Success", "success");
      } else {
        if (typeof onFail === "function") onFail(data);
        MODAL.showSnackbar(data?.message ?? "Failed");
      }
    } catch (err) {
      console.log(`err gloReducer`, err);
      if (
        (err.response?.status === 400 || err.response?.status === 401) &&
        (err.response?.data.message === "TokenExpiredError" ||
          err.response?.data.message === "UNAUTORIZED")
      ) {
        // UDAH DI HANDLE DI setupAxios, gausah nampil apa2
      } else if (err.hasOwnProperty("response")) {
        if (typeof onFail === "function") onFail(err.response?.data);
        MODAL.showSnackbar(
          err.response?.data?.message ?? "Error API, please contact developer!"
        );
      } else {
        if (typeof onFail === "function") onFail(err);
        MODAL.showSnackbar(
          err?.message ?? "Error API, please contact developer!"
        );
      }
    }
    // yield delay(1000);
    if (key) yield put(set_loading_done_rd(key));
  });
}
