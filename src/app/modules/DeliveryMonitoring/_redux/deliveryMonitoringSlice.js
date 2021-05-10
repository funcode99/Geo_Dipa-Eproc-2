import { persistReducer } from "redux-persist";
import { PERSIST_REDUCER } from "../../../../redux/BaseHost";
import { actionTypes } from "./deliveryMonitoringAction";

const initialDelivMonitoringState = {
  dataDeverableDoc: null,
  dataContracts: [],
};

export const reducer = persistReducer(
    PERSIST_REDUCER,
    (state = initialDelivMonitoringState, action) => {
    switch (action.type) {
        case actionTypes.SetDataDeverableDoc: {
          const { dataDeverableDoc } = action.payload;
          return { ...state, dataDeverableDoc };
        }
        
        case actionTypes.SetDataContracts: {
          return {
            ...state,
            dataContracts: action.payload,
          }
        }


        default:
          return state;
      }
    }
);

export const setDataDeverableDoc = dataDeverableDoc => ({ 
  type: actionTypes.SetDataDeverableDoc, 
  payload: { dataDeverableDoc } 
});