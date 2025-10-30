import axios from '@social/configs/axios/axiosCustom';
import type {
  IFormCreatePost,
  IPost,
  IPostLike,
} from '@social/types/posts.type';
import type {
  IBackendRes,
  IBackendResPagination,
} from '@social/types/backend.type';

export const callApiCreatePost = (data: IFormCreatePost) => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/posts', data);
};

export const callApiFetchPosts = (query?: string) => {
  return axios.get<IBackendResPagination<IPost[]>>(
    `/api/v1/posts?${query ? query : ''}`
  );
};

export const callApiGetPostDetail = (postId: string) => {
  return axios.get<IBackendRes<IPost>>(`/api/v1/posts/${postId}`);
};

export const callApiPostLike = (data: IPostLike) => {
  return axios.post<IBackendRes<{ type: number; isLike: boolean }>>(
    `/api/v1/posts/likes`,
    data
  );
};
