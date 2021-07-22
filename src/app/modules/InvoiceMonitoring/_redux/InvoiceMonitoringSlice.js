import { persistReducer } from "redux-persist";
import { PERSIST_REDUCER } from "../../../../redux/BaseHost";
import { actionTypes } from "./InvoiceMonitoringAction";

const initialInvoiceState = {
  dataInvoiceVendor: {},
  dataReceiptVendor: {},
  dataSprVendor: {},
  dataTaxVendor: {},
};

export const reducer = persistReducer(
  PERSIST_REDUCER,
  (state = initialInvoiceState, action) => {
    switch (action.type) {
      case actionTypes.SetDataInvoiceVendor: {
        return { ...state, dataInvoiceVendor: action.payload };
      }

      case actionTypes.SetDataReceiptVendor: {
        return {
          ...state,
          dataReceiptVendor: action.payload,
        };
      }

      case actionTypes.SetDataSprVendor: {
        return {
          ...state,
          dataSprVendor: action.payload,
        };
      }

      case actionTypes.SetDataTaxVendor: {
        return {
          ...state,
          dataTaxVendor: action.payload,
        };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  set_data_invoice_vendor: (payload) => ({
    type: actionTypes.SetDataInvoiceVendor,
    payload,
  }),
  set_data_receipt_vendor: (payload) => ({
    type: actionTypes.SetDataReceiptVendor,
    payload,
  }),
  set_data_spr_vendor: (payload) => ({
    type: actionTypes.SetDataSprVendor,
    payload,
  }),
  set_data_tax_vendor: (payload) => ({
    type: actionTypes.SetDataTaxVendor,
    payload,
  }),
};
