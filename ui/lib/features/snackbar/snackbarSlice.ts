import { createSlice } from "@reduxjs/toolkit";

type SnackbarState = {
  message: string;
};

const initialState: SnackbarState = {
  message: "",
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.message = payload;
    },
    hideLastMessage: (state) => {
      state.message = "";
    },
  },
});

export const { addMessage, hideLastMessage } = snackbarSlice.actions;

export default snackbarSlice.reducer;
