import type { IUserConversation } from './user.type';

export interface IConversation {
  _id: string;
  users: {
    _id: string;
    fullname: string;
    avatar: string;
    isOnline: boolean;
  }[];
  isGroup: boolean;
  name?: string;
  avatar?: string;
  usersState: {
    user: string;
    readLastMessage: string;
  }[];
  admins?: string[];
  lastMessage?: {
    _id: string;
    content: string;
    sender: string;
    type: string;
  };
  lastMessageAt: string;
  isExist: boolean;
  lastActive: string;
  isOnline: boolean;
}

export interface IConversationState {
  openConversations: IConversation[];
  listConversations: IConversation[];
  groupConversations: IConversation[];
  friendConversations: IUserConversation[];
  total: number;
  unSeenConversations: string[];
}

export interface IEditConversation {
  name: string;
  avatar: string;
  conversationId: string;
}

export interface IFetchConversationResponse {
  conversations: IConversation[];
}

export interface ICreateConversation {
  name: string;
  avatar: string;
  userIds: string[];
}

export interface IAddMemberToConversation {
  userIds: string[];
  conversationId: string;
}

export interface IRemoveMemberFromConversation {
  userId: string;
  conversationId: string;
}

export interface IGrantAdminToConversation {
  userId: string;
  conversationId: string;
}

export interface IRevokeAdminFromConversation {
  userId: string;
  conversationId: string;
}
