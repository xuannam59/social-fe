import type { IBackendRes } from '@social/types/backend.type';
import axios from '@social/configs/axios/axiosCustom';
import type {
  IUser,
  IUserConversation,
  IUserFriendList,
} from '@social/types/user.type';

export const callApiGetUserInfo = async (userId: string) => {
  return axios.get<IBackendRes<IUser>>(`/api/v1/users/${userId}`);
};

export const callApiFetchUserFriendList = async (query?: string) => {
  return axios.get<IBackendRes<IUserFriendList>>(
    `/api/v1/users/friend-list?${query || ''}`
  );
};

export const callApiConversationFriendList = async (query?: string) => {
  return axios.get<IBackendRes<IUserConversation[]>>(
    `/api/v1/users/conversation-friend-list?${query || ''}`
  );
};
