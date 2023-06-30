/**
 * See https://redux.js.org/api/api-reference
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import changeReducer from "./changes/changeSlice";
import profileReducer from "./profile/profileSlice";
import exercisePrefsReducer from "./exercise/prefsSlice";
import apiReducer, { Api } from "./api/api";
import { setupListeners } from "@reduxjs/toolkit/query";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [Api.reducerPath],
};

const appReducer = combineReducers({
  changes: changeReducer,
  profile: profileReducer,
  exercisePrefs: exercisePrefsReducer,
  [Api.reducerPath]: apiReducer,
});

/**
 * Clear cache on logout.
 * @param state   current state
 * @param action  the action, clear only when receiving a logout action
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: any, action: any) => {
  if (action.type === "USER_LOGOUT") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure the cache.
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(Api.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type rootState = ReturnType<typeof store.getState>;
export type appDispatch = typeof store.dispatch;
