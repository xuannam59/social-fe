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
  RECEIVE: 'chat:receive',
  STATUS_MESSAGE: 'chat:status_message',
  REACTION: 'chat:reaction',
  READ: 'chat:read',
  TYPING: 'chat:typing',
  STOP_TYPING: 'chat:stop_typing',
};
