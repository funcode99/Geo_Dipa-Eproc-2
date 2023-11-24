import { persistReducer } from "redux-persist";
import { PERSIST_REDUCER } from "../../../../redux/BaseHost";
import { actionTypes } from "./deliveryMonitoringAction";

const initialDelivMonitoringState = {
  dataDeverableDoc: null,
  dataContractById: [],
  dataJasa: [],
  dataBarang: [],
  dataDocuments: [],
  dataSubmitItems: {
    task_items: [],
    task_services: [],
  },
  dataTask: {},
  dataOrderItems: [],
  dataTempOrderItems: [],
  dataUpdateOrderItems: [],
  notifDeliveryMonitoring: [],
  notifMeta: {
    page: 1,
    per_page: 10,
    data_unread: 0,
    data_available: 0,
    total_page: 1,
  },
};

export const reducer = persistReducer(
  PERSIST_REDUCER,
  (state = initialDelivMonitoringState, action) => {
    switch (action.type) {
      case actionTypes.SetDataDeverableDoc: {
        const { dataDeverableDoc } = action.payload;
        return { ...state, dataDeverableDoc };
      }

      case actionTypes.SetDataJasa: {
        return {
          ...state,
          dataJasa: action.payload,
        };
      }

      case actionTypes.SetDataBarang: {
        return {
          ...state,
          dataBarang: action.payload,
        };
      }

      case actionTypes.SetDataDocuments: {
        return {
          ...state,
          dataDocuments: action.payload,
        };
      }

      case actionTypes.SetContractById: {
        return {
          ...state,
          dataContractById: action.payload,
        };
      }

      case actionTypes.SetSubmitItemsByContractId: {
        return {
          ...state,
          dataSubmitItems: action.payload,
        };
      }

      case actionTypes.SetDataTask: {
        return {
          ...state,
          dataTask: action.payload,
        };
      }

      case actionTypes.SetDataOrderItems: {
        return {
          ...state,
          dataOrderItems: action.payload,
        };
      }

      case actionTypes.SetDataTempOrderItems: {
        return {
          ...state,
          dataTempOrderItems: action.payload,
        };
      }

      case actionTypes.SetDataUpdateOrderItems: {
        return {
          ...state,
          dataUpdateOrderItems: action.payload,
        };
      }

      case actionTypes.saveNotifDM: {
        const { list, meta } = action.payload;
        return {
          ...state,
          notifDeliveryMonitoring: list,
          notifMeta: meta,
        };
      }

      default:
        return state;
    }
  }
);

// actions below
export const setDataDeverableDoc = (dataDeverableDoc) => ({
  type: actionTypes.SetDataDeverableDoc,
  payload: { dataDeverableDoc },
});

export const set_contract_id = (payload) => ({
  type: actionTypes.SetContractById,
  payload,
});

export const store_notif_dm_rd = (payload) => ({
  type: actionTypes.saveNotifDM,
  payload,
});
