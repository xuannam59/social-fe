import axios from '@social/configs/axios/axiosCustom';
import type { IBackendResPagination } from '@social/types/backend.type';
import type { IMessage } from '@social/types/messages.type';

export const callApiGetMessages = (
  conversationId: string,
  params?: { page?: number; limit?: number }
) => {
  return axios.get<IBackendResPagination<IMessage>>(
    `/api/v1/messages/${conversationId}`,
    { params }
  );
};
