import { persistReducer } from 'redux-persist';
import { PERSIST_REDUCER } from '../../../../redux/BaseHost';
import { actionTypes } from './deliveryMonitoringAction';

const initialDelivMonitoringState = {
  dataDeverableDoc: null,
  dataContractById: [],
  dataJasa: [],
  dataBarang: [],
  dataDocuments: [],
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

      default:
        return state;
    }
  }
);

export const setDataDeverableDoc = (dataDeverableDoc) => ({
  type: actionTypes.SetDataDeverableDoc,
  payload: { dataDeverableDoc },
});
