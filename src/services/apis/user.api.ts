import type {
  IBackendRes,
  IBackendResPagination,
} from '@social/types/backend.type';
import axios from '@social/configs/axios/axiosCustom';
import type {
  IUser,
  IUserConversation,
  IUserFriendList,
  IUpdateProfile,
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

export const callApiUpdateUserAvatar = async (avatar: string) => {
  return axios.patch<IBackendRes<string>>(`/api/v1/users/avatar`, { avatar });
};

export const callApiUpdateUserCover = async (cover: string) => {
  return axios.patch<IBackendRes<string>>(`/api/v1/users/cover`, { cover });
};

export const callApiUpdateProfile = async (data: IUpdateProfile) => {
  return axios.patch<IBackendRes<string>>(`/api/v1/users/profile`, data);
};

export const callApiGetFriendByUserId = async (
  userId: string,
  query?: string
) => {
  return axios.get<IBackendResPagination<IUser[]>>(
    `/api/v1/users/friends/${userId}?${query || ''}`
  );
};
