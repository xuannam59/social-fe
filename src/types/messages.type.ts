export interface IMessage {
  _id: string;
  tempId?: string;
  sender: { _id: string; fullname: string; avatar: string };
  type: string;
  conversationId: string;
  content: string;
  mentions: {
    userId: string;
    position: {
      start: number;
      end: number;
    };
  }[];
  userLiked: {
    userId: string;
    type: number;
  }[];
  status: 'pending' | 'success' | 'failed';
  revoke?: boolean;
  edited?: boolean;
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
