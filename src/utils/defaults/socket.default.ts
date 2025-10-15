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
  STATUS_MESSAGE: 'chat:status_message',
  REACTION: 'chat:reaction',
  READ: 'chat:read',
  TYPING: 'chat:typing',
  REVOKE: 'chat:revoke',
};

export const HEADER_MESSAGE = {
  UN_SEEN_CONVERSATION: 'header:un_seen_conversation',
};
