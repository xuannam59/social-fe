export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  cover: string;
  phone?: string;
  address?: string;
  followers: string[];
  following: string[];
  role: string;
  isActive: boolean;
  isOnline: boolean;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
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
  friends: IUserTag[];
  total: number;
}

export interface IUserConversation extends IUser {
  conversationId?: string;
  isGroup: boolean;
  isExist: boolean;
  usersState: {
    user: string;
    readLastMessage: string;
  }[];
  lastMessage?: {
    _id: string;
    content: string;
    sender: string;
    type: string;
  };
}

export interface IUpdateProfile {
  fullname: string;
  phone: string;
  address: string;
}
