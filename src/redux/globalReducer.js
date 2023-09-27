import { isEmpty } from "lodash";
import { persistReducer } from "redux-persist";
import { call, delay, put, takeEvery } from "redux-saga/effects";
import apiHelper from "app/service/helper/apiHelper";
import { MODAL } from "../service/modalSession/ModalService";
import { PERSIST_REDUCER } from "./BaseHost";

const globalRedTypes = {
  SET_LOADING: "SET_LOADING",
  SET_LOADING_DONE: "SET_LOADING_DONE",
  FETCH_API_SAGA: "FETCH_API_SAGA",
  CLEAR_LOADING: "CLEAR_LOADING_STATE",
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
      case globalRedTypes.CLEAR_LOADING:
        return {
          ...state,
          loadings: [],
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
export const clean_loading_state_rd = (payload) => ({
  type: globalRedTypes.CLEAR_LOADING,
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
}

export const getAuthorizedUser = ({ auth, deliveryMonitoring }) => {
  const plant_data = auth?.user?.data?.plant_data;
  const facility_id =
    deliveryMonitoring?.dataContractById?.authority?.facility_id;
  const filter_auth_user = plant_data?.filter(({ id }) => id === facility_id);
  return filter_auth_user?.length > 0;
};

export const getClientStatus = ({ auth }) => {
  const client_role = "TMS : User Division";
  const roles_eproc = auth?.user?.data?.roles_eproc;
  const filteredData = roles_eproc?.filter(({ name }) => name === client_role);
  return !!filteredData?.length > 0;
};

export const getClientIsAdmin = ({ auth }) => {
  const client_role = "DM : PMO";
  const roles_eproc = auth?.user?.data?.roles_eproc;
  const filteredData = roles_eproc?.filter(({ name }) => name === client_role);
  return !!filteredData?.length > 0;
};

export const getFinanceUser = ({ auth }) => {
  return auth?.user?.data?.is_finance;
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
    const { key, onSuccess, onFail, alertAppear = false } = action.payload
    if (key) yield put(set_loading_rd(key))
    try {
      let { data } = yield call(apiHelper.fetchGlobalApi, action.payload)
      // let data = yield call(apiHelper.fetchGlobalApi, action.payload);
      console.log(`resnew + ${key}`, data)
      if (data.status === true || data.status === "success") {
        if (typeof onSuccess === "function") onSuccess(data)
        if (alertAppear === "both")
          MODAL.showSnackbar(data?.message ?? "Success", "success")
      } else {
        if (typeof onFail === "function") onFail(data)
        MODAL.showSnackbar(data?.message ?? "Failed")
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
        console.log(`err gloReducer2`, err);
        if (alertAppear === "never") return;
        if (typeof onFail === "function") onFail(err.response?.data);
        MODAL.showSnackbar(
          err.response?.data?.message ?? "Error API, please contact developer!"
        )
      } else {
        console.log(`err gloReducer3`, err);
        if (alertAppear === "never") return;
        if (typeof onFail === "function") onFail(err);
        MODAL.showSnackbar(
          err?.message ?? "Error API, please contact developer!"
        );
      }
    }
    // yield delay(1000);
    if (key) yield put(set_loading_done_rd(key))
  })
}
