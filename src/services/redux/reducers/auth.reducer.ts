import type { IAuthState } from '@social/types/auths.type';
import { USER_DEFAULT } from '@social/defaults/user.default';
import { createSlice } from '@reduxjs/toolkit';

const initialState: IAuthState = {
  user: USER_DEFAULT,
  isLoading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUser, setIsLoading, setIsAuthenticated } = authSlice.actions;
export const authReducer = authSlice.reducer;
