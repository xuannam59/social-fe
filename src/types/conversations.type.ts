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
  total: number;
  unSeenConversations: string[];
}

export interface IFetchConversationResponse {
  conversations: IConversation[];
}
