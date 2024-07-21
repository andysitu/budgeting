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

    await login(username, password);
  }
);

const initialState: UserAccountState = {
  account: null,
  loggedIn: false,
  checkedLoginStatus: false,
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
      state.checkedLoginStatus = true;
    });
    builder.addCase(checkLoginStatus.fulfilled, (state, action) => {
      const account = action.payload;

      state.loggedIn = Object.keys(account).length > 0;
      state.account = account;
    });

    builder.addCase(handleLogout.fulfilled, (state, action) => {
      state.loggedIn = false;
    });

    builder.addCase(handleLogin.fulfilled, (state, action) => {
      state.loggedIn = true;
    });
  },
});

export const { setUser } = userAccountSlice.actions;

export default userAccountSlice.reducer;

export { checkLoginStatus, handleLogin, handleLogout };
