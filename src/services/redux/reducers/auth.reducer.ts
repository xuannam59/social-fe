import type { IAuthState } from '@social/types/auths.type';
import { USER_DEFAULT } from '@social/defaults/user.default';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IAuthState = {
  userInfo: USER_DEFAULT,
  isLoading: true,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    doLogin: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    doGetAccount: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { doLogin, doGetAccount, setIsLoading, setIsAuthenticated } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
