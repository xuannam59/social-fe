import axios from '@social/configs/axios/axiosCustom';
import type { ILoginForm, IRegisterForm } from '@social/types/auths.type';
import type { IBackendRes } from '@social/types/backend.type';

export const callApiRegister = (data: IRegisterForm) => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/auths/register', data);
};

export const callApiLogin = (data: ILoginForm) => {
  return axios.post<IBackendRes<{ access_token: string; refresh_token: string }>>('/api/v1/auths/login', data);
};
