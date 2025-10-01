import type { IBackendRes } from '@social/types/backend.type';
import axios from '@social/configs/axios/axiosCustom';
import type { IFriend } from '@social/types/friends.type';

export const callApiRequestFriend = (toUserId: string) => {
  return axios.post<IBackendRes<IFriend>>(`/api/v1/friends/request`, {
    toUserId,
  });
};

export const callApiAcceptFriend = (fromUserId: string) => {
  return axios.post<IBackendRes<{ status: string }>>(`/api/v1/friends/accept`, {
    fromUserId,
  });
};

export const callApiRejectFriend = (userId: string) => {
  return axios.post<IBackendRes<{ _id: string }>>(`/api/v1/friends/reject`, {
    userId,
  });
};

export const callApiUnfriend = (userId: string) => {
  return axios.post<IBackendRes<{ _id: string }>>(`/api/v1/friends/unfriend`, {
    userId,
  });
};

export const callApiGetFriendStatus = (userId: string) => {
  return axios.get<IBackendRes<IFriend>>(`/api/v1/friends/${userId}`);
};

export const callApiGetInvitationList = () => {
  return axios.get<IBackendRes<IFriend[]>>(`/api/v1/friends/invite`);
};
