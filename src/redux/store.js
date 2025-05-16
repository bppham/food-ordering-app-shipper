"use client";
import { configureStore } from "@reduxjs/toolkit";
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
import { thunk } from "redux-thunk";
import { combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./feature/api/apiSlice";
import chatReducer from "./feature/Chat/chatSlice";
import messageReducer from "./feature/Message/messageSlice";

const rootReducer = combineReducers({
  chat: chatReducer,
  message: messageReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const persistStorage =
  typeof window !== "undefined" ? storage : createNoopStorage();

const persistConfig = {
  key: "root",
  storage: persistStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(thunk, apiSlice.middleware),
});

export const persistor = persistStore(store, null, () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("persist:root");
  }
});
