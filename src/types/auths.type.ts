import type { IUser } from './user.type';

export interface ILoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface ILoginResponse {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  accessToken: string;
}

export interface IRegisterForm {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IForgotPasswordForm {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IAuthState {
  userInfo: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface IVerifyOtpForm {
  email: string;
  otp: string;
}
