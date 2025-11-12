import axios from '@social/configs/axios/axiosCustom';
import type {
  IBackendRes,
  IBackendResPagination,
} from '@social/types/backend.type';
import type { INotificationResponse } from '@social/types/notifications.type';

export const callApiGetNotifications = (query?: string) => {
  return axios.get<IBackendResPagination<INotificationResponse[]>>(
    `/api/v1/notifications${query ? `?${query}` : ''}`
  );
};

export const callApiGetUnSeenNotifications = () => {
  return axios.get<IBackendRes<string[]>>(`/api/v1/notifications/un-seen`);
};

export const callApiReadNotifications = (notificationId: string) => {
  return axios.patch<IBackendRes<string>>(
    `/api/v1/notifications/read/${notificationId}`
  );
};
