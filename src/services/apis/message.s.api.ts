import axios from '@social/configs/axios/axiosCustom';
import type { IBackendRes } from '@social/types/backend.type';
import type { IMessage } from '@social/types/messages.type';

export const callApiGetMessages = (conversationId: string) => {
  return axios.get<IBackendRes<IMessage[]>>(
    `/api/v1/messages/${conversationId}`
  );
};
