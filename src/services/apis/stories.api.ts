import axios from '@social/configs/axios/axiosCustom';
import type { IBackendRes } from '@social/types/backend.type';
import type { IFormCreateStory, IUserStory } from '@social/types/stories.type';

export const callApiCreateStory = async (data: IFormCreateStory) => {
  return axios.post<IBackendRes<{ _id: string }>>('/api/v1/stories', data);
}

export const callApiGetStories = async () => {
  return axios.get<IBackendRes<IUserStory[]>>('/api/v1/stories');
}