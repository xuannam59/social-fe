export const SOCKET_MESSAGE = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTION_ERROR: 'connection_error',
};

export const CONVERSATION_MESSAGE = {
  JOIN: 'conversations:join',
  LEAVE: 'conversations:leave',
};

export const CHAT_MESSAGE = {
  SEND: 'chat:send',
  EDIT: 'chat:edit',
  REACTION: 'chat:reaction',
  READ: 'chat:read',
  TYPING: 'chat:typing',
  REVOKE: 'chat:revoke',
};

export const HEADER_MESSAGE = {
  UN_SEEN_CONVERSATION: 'header:un_seen_conversation',
};

export const NOTIFICATION_MESSAGE = {
  SEND: 'notification:send',
  POST_TAG: 'notification:post_tag',
  POST_LIKE: 'notification:post_like',
  POST_COMMENT: 'notification:post_comment',
  POST_SHARE: 'notification:post_share',
  COMMENT_MENTION: 'notification:comment_mention',
  COMMENT_LIKE: 'notification:comment_like',
  COMMENT_REPLY: 'notification:comment_reply',
  RESPONSE: 'notification:response',
};
