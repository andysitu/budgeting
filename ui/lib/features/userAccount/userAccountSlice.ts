import { fetchLoginStatus } from "@/network/login";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const checkLoginStatus = createAsyncThunk(
  "userAccount/checkLoginStatus",
  async () => {
    const loggedIn = await fetchLoginStatus();
    return loggedIn;
  }
);

export const userAccountSlice = createSlice({
  name: "userAccount",
  initialState: {
    user: null,
    loggedIn: false,
    checkedLoginStatus: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkLoginStatus.pending, (state) => {
      state.checkedLoginStatus = true;
    });
    builder.addCase(checkLoginStatus.fulfilled, (state, action) => {
      state.loggedIn = action.payload;
    });
  },
});

export const { setUser } = userAccountSlice.actions;

export default userAccountSlice.reducer;

export { checkLoginStatus };
