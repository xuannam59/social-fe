import axios from '@social/configs/axios/axiosCustom';
import type {
  IBackendRes,
  IBackendResPagination,
} from '@social/types/backend.type';
import type {
  IAddMemberToConversation,
  IConversation,
  ICreateConversation,
  IEditConversation,
  IGrantAdminToConversation,
  IRemoveMemberFromConversation,
  IRevokeAdminFromConversation,
} from '@social/types/conversations.type';

export const callApiGetConversations = (query?: string) => {
  return axios.get<IBackendResPagination<IConversation[]>>(
    `/api/v1/conversations${query ? `?${query}` : ''}`
  );
};

export const callApiGetConversationIdOrCreate = (
  userIds: string[],
  isGroup: boolean
) => {
  return axios.post<IBackendRes<IConversation>>(
    `/api/v1/conversations/id-or-create`,
    {
      userIds,
      isGroup,
    }
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

export const callApiAddMemberToConversation = (
  payload: IAddMemberToConversation
) => {
  return axios.patch<IBackendRes<IConversation>>(
    `/api/v1/conversations/add-members`,
    payload
  );
};

export const callApiRemoveMemberFromConversation = (
  payload: IRemoveMemberFromConversation
) => {
  return axios.patch<IBackendRes<IConversation>>(
    `/api/v1/conversations/remove-member`,
    payload
  );
};

export const callApiGrantAdminToConversation = (
  payload: IGrantAdminToConversation
) => {
  return axios.patch<IBackendRes<IConversation>>(
    `/api/v1/conversations/grant-admin`,
    payload
  );
};

export const callApiRevokeAdminFromConversation = (
  payload: IRevokeAdminFromConversation
) => {
  return axios.patch<IBackendRes<IConversation>>(
    `/api/v1/conversations/revoke-admin`,
    payload
  );
};

export const callApiEditConversation = (data: IEditConversation) => {
  return axios.patch<IBackendRes<string>>(`/api/v1/conversations/edit`, data);
};

export const callApiDeleteConversation = (conversationId: string) => {
  return axios.delete<IBackendRes<string>>(
    `/api/v1/conversations/${conversationId}`
  );
};

export const callApiLeaveConversation = (conversationId: string) => {
  return axios.patch<IBackendRes<string>>(`/api/v1/conversations/leave`, {
    conversationId,
  });
};
