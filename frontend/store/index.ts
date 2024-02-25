import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import { refreshApi } from "./auth/apiSlice";
import stateSlice from "./state/stateSlice";
import modalSlice from "./modal/modalSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    auth: authSlice,
    state: stateSlice,
    modal: modalSlice,

    [refreshApi.reducerPath]: refreshApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(refreshApi.middleware),
});

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
