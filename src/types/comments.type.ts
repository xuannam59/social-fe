export interface IComment {
  _id: string;
  postId: string;
  parentId?: string;
  userId: string;
  content: string;
  medias: {
    keyS3: string;
    type: 'image';
  }[];
  mentions: {
    userId: string;
    position: {
      start: number;
      end: number;
    };
  }[];
  likeCount: number;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFormComment {
  content: string;
  medias: {
    keyS3: string;
    type: string;
  }[];
  mentions: {
    userInfo: string;
    position: {
      start: number;
      end: number;
    };
  }[];
}
