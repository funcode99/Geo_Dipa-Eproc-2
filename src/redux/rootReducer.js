import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import * as addendumContract from "app/modules/AddendumContract/_redux/deliveryMonitoringSlice"
import * as deliveryMonitoring from "../app/modules/DeliveryMonitoring/_redux/deliveryMonitoringSlice";
import * as globalReducer from "./globalReducer";
import * as invoiceMonitoring from "../app/modules/InvoiceMonitoring/_redux/InvoiceMonitoringSlice";
// import {customersSlice} from "../app/modules/ECommerce/_redux/customers/customersSlice";
// import {productsSlice} from "../app/modules/ECommerce/_redux/products/productsSlice";
// import {remarksSlice} from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
// import {specificationsSlice} from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  deliveryMonitoring: deliveryMonitoring.reducer,
  globalReducer: globalReducer.reducer,
  invoiceMonitoring: invoiceMonitoring.reducer,
  addendumContract: addendumContract.reducer
  // products: productsSlice.reducer,
  // remarks: remarksSlice.reducer,
  // specifications: specificationsSlice.reducer
});

export function* rootSaga() {
  yield all([auth.saga(), globalReducer.saga()]);
}
