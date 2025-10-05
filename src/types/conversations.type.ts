export interface IConversation {
  _id: string;
  users: string[];
  isGroup: boolean;
  name?: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  isExist: boolean;
  lastActive: string;
  isOnline: boolean;
}

export interface IConversationState {
  openConversations: IConversation[];
  conversations: IConversation[];
}
