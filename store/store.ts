import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiSlice from "./api/apiSlice";
import cartReducer from "./actions/CartAction"
import { addToCart } from "./actions/CartAction";
const cartPersistConfig = {
  key: "cart",
  storage: AsyncStorage,
};


const persistedCartReducer = persistReducer(
  cartPersistConfig,
  cartReducer
);

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: persistedCartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
