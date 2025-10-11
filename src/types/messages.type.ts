export interface IMessage {
  _id: string;
  tempId?: string;
  sender: { _id: string; fullname: string; avatar: string };
  type: string;
  conversationId: string;
  content: string;
  parentId?: {
    _id: string;
    content: string;
    type: string;
    sender: { _id: string; fullname: string };
  };
  mentions: {
    userId: string;
    position: {
      start: number;
      end: number;
    };
  }[];
  userLikes: {
    userId: string;
    type: number;
  }[];
  typeSend: 'send' | 'edit';
  status: 'pending' | 'success' | 'failed';
  revoke?: boolean;
  edited?: boolean;
  timeEdited?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMessageStatus {
  conversationId: string;
  senderId: string;
  tempId: string;
  status: 'pending' | 'success' | 'failed';
  message: string;
}

export interface IMessageTyping {
  conversationId: string;
  sender: { _id: string; fullname: string; avatar: string };
  status: 'typing' | 'stop_typing';
}

export interface IMessageReaction {
  conversationId: string;
  messageId: string;
  userId: string;
  type: number;
  isLike: boolean;
  status: 'success' | 'failed';
  message?: string;
}
