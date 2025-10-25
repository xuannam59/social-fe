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

export enum ENotificationType {
  POST_TAG = 'post_tag',
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  POST_SHARE = 'post_share',
  COMMENT_MENTION = 'comment_mention',
  COMMENT_LIKE = 'comment_like',
  COMMENT_REPLY = 'comment_reply',
}

export enum EEntityType {
  POST = 'post',
  COMMENT = 'comment',
  STORY = 'story',
  MESSAGE = 'message',
  CONVERSATION = 'conversation',
  FRIEND = 'friend',
  SYSTEM = 'system',
}
