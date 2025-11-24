import type { IUser } from '@social/types/user.type';

export const USER_DEFAULT: IUser = {
  _id: '',
  fullname: '',
  email: '',
  phoneNumber: '',
  avatar: '',
  role: '',
  isActive: false,
  cover: '',
  followers: [],
  following: [],
  friends: [],
  createdAt: '',
  updatedAt: '',
  isOnline: false,
  lastActive: '',
};
