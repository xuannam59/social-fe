import axios from '@social/configs/axios/axiosCustom';
import type {
  IFormCreatePost,
  IPost,
  IPostLike,
  IFormCreatePostShare,
} from '@social/types/posts.type';
import type {
  IBackendRes,
  IBackendResPagination,
} from '@social/types/backend.type';

export const callApiCreatePost = (data: IFormCreatePost) => {
  return axios.post<IBackendRes<IPost>>('/api/v1/posts', data);
};

export const callApiCreatePostShare = (data: IFormCreatePostShare) => {
  return axios.post<IBackendRes<IPost>>('/api/v1/posts/share', data);
};

export const callApiPostLike = (data: IPostLike) => {
  return axios.post<IBackendRes<{ type: number; isLike: boolean }>>(
    `/api/v1/posts/likes`,
    data
  );
};

export const callApiFetchPosts = (query?: string) => {
  return axios.get<IBackendResPagination<IPost[]>>(
    `/api/v1/posts?${query ? query : ''}`
  );
};

export const callApiFetchPostsByUserId = (userId: string, query?: string) => {
  return axios.get<IBackendResPagination<IPost[]>>(
    `/api/v1/posts/user/${userId}?${query ? query : ''}`
  );
};

export const callApiGetPostDetail = (postId: string) => {
  return axios.get<IBackendRes<IPost>>(`/api/v1/posts/${postId}`);
};

export const callApiUpdatePost = (postId: string, data: IFormCreatePost) => {
  return axios.patch<IBackendRes<string>>(`/api/v1/posts/${postId}`, data);
};

export const callApiDeletePost = (postId: string) => {
  return axios.delete<IBackendRes<string>>(`/api/v1/posts/${postId}`);
};
