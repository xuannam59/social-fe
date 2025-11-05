import type { IAuthState } from '@social/types/auths.type';
import { USER_DEFAULT } from '@social/defaults/user.default';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUpdateProfile } from '@social/types/user.type';

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
    doUpdateAvatar: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        avatar: action.payload,
      };
    },
    doUpdateCover: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        cover: action.payload,
      };
    },
    doGetAccount: (state, action) => {
      state.userInfo = {
        ...action.payload,
        isOnline: true,
      };
      state.isAuthenticated = true;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    doUpdateProfile: (state, action: PayloadAction<IUpdateProfile>) => {
      state.userInfo.fullname = action.payload.fullname;
      state.userInfo.phone = action.payload.phone;
      state.userInfo.address = action.payload.address;
    },
  },
});

export const {
  doLogin,
  doUpdateAvatar,
  doUpdateCover,
  doGetAccount,
  setIsLoading,
  setIsAuthenticated,
  doUpdateProfile,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
