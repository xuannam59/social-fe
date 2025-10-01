import type { IUser } from './user.type';

export interface IFriend {
  _id: string;
  fromUserId: string | IUser;
  toUserId: string | IUser;
  users: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export enum EFriendStatus {
  ADD_FRIEND = 'add_friend',
  PENDING_FROM_ME = 'pending_from_me',
  PENDING_TO_ME = 'pending_to_me',
  FRIENDS = 'friends',
}
