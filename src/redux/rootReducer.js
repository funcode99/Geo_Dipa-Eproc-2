import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "../app/modules/Auth/_redux/authRedux";
import * as deliveryMonitoring from "../app/modules/DeliveryMonitoring/_redux/deliveryMonitoringSlice";
import { globalReducer } from "./globalReducer";
// import {customersSlice} from "../app/modules/ECommerce/_redux/customers/customersSlice";
// import {productsSlice} from "../app/modules/ECommerce/_redux/products/productsSlice";
// import {remarksSlice} from "../app/modules/ECommerce/_redux/remarks/remarksSlice";
// import {specificationsSlice} from "../app/modules/ECommerce/_redux/specifications/specificationsSlice";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  deliveryMonitoring: deliveryMonitoring.reducer,
  globalReducer,
  // customers: customersSlice.reducer,
  // products: productsSlice.reducer,
  // remarks: remarksSlice.reducer,
  // specifications: specificationsSlice.reducer
});

export function* rootSaga() {
  yield all([auth.saga()]);
}
