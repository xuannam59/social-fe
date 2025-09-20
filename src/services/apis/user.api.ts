import type { IBackendRes } from '@social/types/backend.type';
import axios from '@social/configs/axios/axiosCustom';
import type { IUser } from '@social/types/user.type';

const callApiGetUserInfo = async (userId: string) => {
  return axios.get<IBackendRes<IUser>>(`/api/v1/users/${userId}`);
};

export { callApiGetUserInfo };
