import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
  },
  reducers: {
    login: (state, action) => {
      state.isLogin = action.payload;
    },
    logout: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
