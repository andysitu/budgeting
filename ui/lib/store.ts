import { configureStore } from "@reduxjs/toolkit";
import userAccountReducer from "./features/userAccount/userAccountSlice";
import snackbarReducer from "./features/snackbar/snackbarSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      userAccount: userAccountReducer,
      snackbar: snackbarReducer,
    },
  });
};

// Infer type of makeStore, Rootstate, and AppDispatch
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
