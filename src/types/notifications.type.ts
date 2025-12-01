export interface INotificationResponse {
  _id: string;
  senderIds: {
    _id: string;
    fullname: string;
    avatar: string;
  }[];
  message: string;
  entityId: string;
  entityType: EEntityType;
  type: ENotificationType;
  seen: boolean;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationState {
  listNotifications: INotificationResponse[];
  unSeenNotifications: Set<string>;
  total: number;
  page: number;
  limit: number;
}

export interface INotificationDelete {
  _id: string;
  friendId: string;
}

export enum ENotificationType {
  POST_TAG = 'post_tag',
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  POST_SHARE = 'post_share',
  COMMENT_MENTION = 'comment_mention',
  COMMENT_LIKE = 'comment_like',
  COMMENT_REPLY = 'comment_reply',
  STORY_REACTION = 'story_reaction',
  FRIEND_REQUEST = 'friend_request',
  FRIEND_REQUEST_ACCEPT = 'friend_request_accept',
}

export enum EEntityType {
  POST = 'post',
  COMMENT = 'comment',
  STORY = 'story',
  MESSAGE = 'message',
  CONVERSATION = 'conversation',
  FRIEND = 'friend',
  SYSTEM = 'system',
  FRIEND_REQUEST = 'friend_request',
}
