import axios from '@social/configs/axios/axiosCustom';
import type { IBackendRes } from '@social/types/backend.type';
import type {
  IChunkedUpload,
  ICompleteChunkedUpload,
  IAbortChunkedUpload,
  IInitChunkedUpload,
} from '@social/types/upload.type';

export const callApiUploadFile = (files: File) => {
  const bodyFormData = new FormData();
  bodyFormData.append('file', files);
  return axios<IBackendRes<{ key: string; url: string }>>({
    method: 'post',
    url: '/api/v1/uploads',
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const callApiInitChunkedUpload = (data: IInitChunkedUpload) => {
  return axios.post<IBackendRes<{ key: string; uploadId: string }>>(
    '/api/v1/uploads/initiate-chunked',
    data
  );
};

export const callApiChunkedUpload = (data: IChunkedUpload) => {
  return axios.post<IBackendRes<{ url: string; partNumber: number }>>(
    '/api/v1/uploads/chunk-url',
    data
  );
};

export const callApiCompleteChunkedUpload = (data: ICompleteChunkedUpload) => {
  return axios.post<
    IBackendRes<{ url: string; key: string; success: boolean }>
  >('/api/v1/uploads/complete-chunked', data);
};

export const callApiAbortChunkedUpload = (data: IAbortChunkedUpload) => {
  return axios.post<IBackendRes<string>>('/api/v1/uploads/abort-chunked', data);
};

export const callApiUploadCloudinary = (file: File, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append('file', file);
  bodyFormData.append('folder-name', folder);
  return axios<IBackendRes<{ fileUpload: string; publicId: string }>>({
    method: 'post',
    url: '/api/v1/uploads/cloudinary',
    data: bodyFormData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
