import { fetchLoginStatus } from "@/network/login";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const checkLoginStatus = createAsyncThunk(
  "userAccount/checkLoginStatus",
  async () => {
    const account = await fetchLoginStatus();
    return account;
  }
);

export const userAccountSlice = createSlice({
  name: "userAccount",
  initialState: {
    account: null,
    loggedIn: false,
    checkedLoginStatus: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.account = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkLoginStatus.pending, (state) => {
      state.checkedLoginStatus = true;
    });
    builder.addCase(checkLoginStatus.fulfilled, (state, action) => {
      const account = action.payload;

      state.loggedIn = Object.keys(account).length > 0;
      state.account = account;
    });
  },
});

export const { setUser } = userAccountSlice.actions;

export default userAccountSlice.reducer;

export { checkLoginStatus };
