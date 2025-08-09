export interface ILoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterForm {
  fullName: string;
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
