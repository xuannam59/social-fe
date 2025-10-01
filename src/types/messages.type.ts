export interface IMessage {
  _id: string;
  sender: { _id: string; fullname: string; avatar: string };
  type: 'text';
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
  revoke?: boolean;
  edited?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
