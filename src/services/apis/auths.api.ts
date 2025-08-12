import axios from '@social/configs/axios/axiosCustom';
import type {
  IForgotPasswordForm,
  ILoginForm,
  IRegisterForm,
  IVerifyOtpForm,
} from '@social/types/auths.type';
import type { IBackendRes } from '@social/types/backend.type';

export const callApiRegister = (data: IRegisterForm) => {
  return axios.post<IBackendRes<{ _id: string }>>(
    '/api/v1/auths/register',
    data
  );
};

export const callApiLogin = (data: ILoginForm) => {
  return axios.post<
    IBackendRes<{ access_token: string; refresh_token: string }>
  >('/api/v1/auths/login', data);
};

export const callApiForgotPassword = (email: string) => {
  return axios.post<IBackendRes<{ email: string }>>(
    '/api/v1/auths/forgot-password',
    { email }
  );
};

export const callApiVerifyOtp = (data: IVerifyOtpForm) => {
  return axios.post<IBackendRes<{ email: string }>>(
    '/api/v1/auths/verify-otp',
    data
  );
};

export const callApiResetPassword = (data: IForgotPasswordForm) => {
  return axios.post<IBackendRes<{ email: string }>>(
    '/api/v1/auths/reset-password',
    data
  );
};

export const callApiGetAccount = () => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/auths/get-account');
};

export const callApiLogout = () => {
  return axios.post<IBackendRes<string>>('/api/v1/auths/logout');
};
