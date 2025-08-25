import axios from '@social/configs/axios/axiosCustom';
import type { IFormCreatePost } from '@social/types/posts.type';
import type { IBackendRes } from '@social/types/backend.type';

export const callApiCreatePost = (data: IFormCreatePost) => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/posts', data);
};
