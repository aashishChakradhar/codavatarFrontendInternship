import { configureStore, combineReducers } from "@reduxjs/toolkit"
import counterReducer from "./counter/counterSlice"
import userReducer from "./user/userSlice"
import orderReducer from "./order/orderSlice"
import menuReducer from "./menu/menuSlice"
import tableReducer from "./table/tableSlice"
import itemReducer from "./order/orderNextSlice"
import toastReducer from "./toast/toastSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({
  counter: counterReducer,
  user: userReducer,
  order: orderReducer,
  menu: menuReducer,
  table: tableReducer,
  toast: toastReducer,
  item: itemReducer,
})

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
