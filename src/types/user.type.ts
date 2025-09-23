export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  cover: string;
  phone: string;
  followers: string[];
  following: string[];
  role: string;
  isActive: boolean;
}

export interface IUserTag {
  _id: string;
  fullname: string;
  avatar: string;
}

export interface IMentionUser {
  id: string;
  display: string;
  avatar: string;
}

export interface IUserFriendList {
  friends: IUser[];
  total: number;
}
