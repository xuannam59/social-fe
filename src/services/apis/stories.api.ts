import axios from '@social/configs/axios/axiosCustom';
import type {
  IBackendRes,
  IBackendResPagination,
} from '@social/types/backend.type';
import type { IFormCreateStory, IUserStory } from '@social/types/stories.type';

export const callApiCreateStory = async (data: IFormCreateStory) => {
  return axios.post<IBackendRes<IUserStory>>('/api/v1/stories', data);
};

export const callApiGetStories = async (query?: string) => {
  return axios.get<IBackendResPagination<IUserStory[]>>(
    `/api/v1/stories?${query ? query : ''}`
  );
};

export const callApiGetUserStories = async (userId: string) => {
  return axios.get<IBackendRes<IUserStory>>(`/api/v1/stories/${userId}`);
};

export const callApiActionLike = async (storyId: string, type: number) => {
  return axios.post<IBackendRes<{ action: string; type: number }>>(
    `/api/v1/stories/likes/${storyId}`,
    { type }
  );
};
