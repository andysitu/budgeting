import { fetchLoginStatus, login, logout } from "@/network/login";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Account = {
  Email: string;
  Id: string;
  UserName: string;
};

type UserAccountState = {
  account: Account | null;
  loggedIn: boolean;
  checkedLoginStatus: boolean;
  checkingLoginStatus: boolean;
};

const checkLoginStatus = createAsyncThunk(
  "userAccount/checkLoginStatus",
  async () => {
    const account = await fetchLoginStatus();
    return account;
  }
);

const handleLogout = createAsyncThunk("userAccount/logout", async () => {
  await logout();
});

const handleLogin = createAsyncThunk(
  "userAccount/login",
  async (data: { username: string; password: string }) => {
    const { username, password } = data;

    const result = await login(username, password);

    return result;
  }
);

const initialState: UserAccountState = {
  account: null,
  loggedIn: false,
  checkedLoginStatus: false,
  checkingLoginStatus: false,
};

export const userAccountSlice = createSlice({
  name: "userAccount",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.account = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkLoginStatus.pending, (state) => {
      state.checkingLoginStatus = true;
    });
    builder.addCase(checkLoginStatus.fulfilled, (state, action) => {
      const account = action.payload;

      console.log("account", account);
      state.checkedLoginStatus = true;

      state.loggedIn = Object.keys(account).length > 0;
      state.account = account;
    });
    builder.addCase(checkLoginStatus.rejected, (state) => {
      state.loggedIn = false;
      state.account = null;
    });

    builder.addCase(handleLogout.fulfilled, (state, action) => {
      state.loggedIn = false;
    });

    builder.addCase(handleLogin.fulfilled, (state, action) => {
      state.loggedIn = action?.payload === true;
    });

    builder.addCase(handleLogin.rejected, (state, action) => {
      state.loggedIn = false;
    });
  },
});

export const { setUser } = userAccountSlice.actions;

export default userAccountSlice.reducer;

export { checkLoginStatus, handleLogin, handleLogout };
