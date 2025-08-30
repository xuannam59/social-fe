import axios from '@social/configs/axios/axiosCustom';
import type {
  IFormCreatePost,
  IActionLike,
  IPost,
} from '@social/types/posts.type';
import type { IBackendRes } from '@social/types/backend.type';

export const callApiCreatePost = (data: IFormCreatePost) => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/posts', data);
};

export const callApiGetPost = () => {
  return axios.get<IBackendRes<IPost[]>>(`/api/v1/posts`);
};

export const callApiActionLike = (data: IActionLike) => {
  return axios.post<IBackendRes<{ type: number; isLike: boolean }>>(
    `/api/v1/posts/likes`,
    data
  );
};

export const callApiGetUserLiked = (postId: string) => {
  return axios.get<IBackendRes<{ _id: string; type: number }>>(
    `/api/v1/posts/likes/${postId}`
  );
};
