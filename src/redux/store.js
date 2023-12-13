import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { reduxBatch } from "@manaflair/redux-batch";
import { persistStore } from "redux-persist";
import { rootReducer, rootSaga } from "./rootReducer";
// Author: Jeffry Azhari Rosman
// Email: Jeffryazhari@gmail.com
// Penambahan Log pada Redux React pada Project. Komen / Hapus Logger jika Project di Deploy
import logger from "redux-logger";
// Penambahan Config settingan redux save to localStrorage
import { saveState, loadState } from "./localStorageRedux";

import throttle from "lodash/throttle";

const sagaMiddleware = createSagaMiddleware();
const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
  }).concat(logger),
  sagaMiddleware,
];

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
  enhancers: [reduxBatch],
  preloadedState: loadState(),
});
store.subscribe(
  throttle(() => {
    saveState(store.getState());
  }, 1000)
);
/**
 * @see https://github.com/rt2zz/redux-persist#persiststorestore-config-callback
 * @see https://github.com/rt2zz/redux-persist#persistor-object
 */
export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;
