import axios from '@social/configs/axios/axiosCustom';
import type { IBackendRes } from '@social/types/backend.type';
import type { IConversation } from '@social/types/conversations.type';

export const callApiGetConversations = () => {
  return axios.get<IBackendRes<IConversation[]>>('/api/v1/conversations');
};

export const callApiGetConversationIdOrCreate = (data: string[]) => {
  return axios.post<IBackendRes<string>>(
    `/api/v1/conversations/id-or-create`,
    data
  );
};
