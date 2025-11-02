import axios from '@social/configs/axios/axiosCustom';
import type {
  IBackendRes,
  IBackendResPagination,
} from '@social/types/backend.type';
import type {
  IConversation,
  ICreateConversation,
} from '@social/types/conversations.type';

export const callApiGetConversations = (query?: string) => {
  return axios.get<IBackendResPagination<IConversation[]>>(
    `/api/v1/conversations${query ? `?${query}` : ''}`
  );
};

export const callApiGetConversationIdOrCreate = (data: string[]) => {
  return axios.post<IBackendRes<IConversation>>(
    `/api/v1/conversations/id-or-create`,
    data
  );
};

export const callApiGetUnSeenConversations = () => {
  return axios.get<IBackendRes<string[]>>(`/api/v1/conversations/un-seen`);
};

export const callApiSeenConversation = (conversationIds: string[]) => {
  return axios.post<IBackendRes<string>>(`/api/v1/conversations/seen`, {
    conversationIds,
  });
};

export const callApiReadConversation = (conversationId: string) => {
  return axios.patch<IBackendRes<string>>(`/api/v1/messages/read`, {
    conversationId,
  });
};

export const callApiCreateConversation = (data: ICreateConversation) => {
  return axios.post<IBackendRes<IConversation>>(`/api/v1/conversations`, data);
};

export const callApiGetGroupConversations = () => {
  return axios.get<IBackendRes<IConversation[]>>(`/api/v1/conversations/group`);
};
