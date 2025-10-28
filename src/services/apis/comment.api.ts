import axios from '@social/configs/axios/axiosCustom';
import type { IBackendRes } from '@social/types/backend.type';
import type {
  IComment,
  ICommentLike,
  IFormComment,
} from '@social/types/comments.type';

export const callApiCreateComment = (data: IFormComment) => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/comments', data);
};

export const callGetComments = (postId: string, query?: string) => {
  return axios.get<IBackendRes<IComment[]>>(
    `/api/v1/comments/${postId}?${query ? query : ''}`
  );
};

export const callApiCommentLike = (data: ICommentLike) => {
  return axios.post<IBackendRes<{ _id: string }>>(
    '/api/v1/comments/likes',
    data
  );
};

export const callApiDeleteComment = (commentId: string) => {
  return axios.delete<
    IBackendRes<{ countDeleted: number; postId: string; commentId: string }>
  >(`/api/v1/comments/${commentId}`);
};
