import axios from '@social/configs/axios/axiosCustom';
import type { IForgotPasswordForm, ILoginForm, IRegisterForm } from '@social/types/auths.type';
import type { IBackendRes } from '@social/types/backend';

export const register = (data: IRegisterForm) => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/auths/register', data);
};

export const login = (data: ILoginForm) => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/auths/login', data);
};
