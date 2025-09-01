export interface IComment {
  _id: string;
  postId: string;
  parentId?: string;
  level: number;
  authorId: {
    _id: string;
    fullname: string;
    avatar: string;
  };
  content: string;
  medias: {
    keyS3: string;
    type: string;
  }[];
  mentions: {
    _id: string;
    userId: string;
    position: {
      start: number;
      end: number;
    };
  }[];
  userLiked: {
    isLiked: boolean;
    type: number | null;
  };
  likeCount: number;
  replyCount: number;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFormComment {
  postId: string;
  content: string;
  parentId?: string;
  medias: {
    keyS3: string;
    type: string;
  }[];
  level: number;
  mentions: {
    userId: string;
    position: {
      start: number;
      end: number;
    };
  }[];
}

export interface ICommentLike {
  commentId: string;
  type: number;
  isLike: boolean;
}
