import {
  callApiAbortChunkedUpload,
  callApiChunkedUpload,
  callApiCompleteChunkedUpload,
  callApiInitChunkedUpload,
  callApiUploadFile,
} from '@social/apis/upload.api';
import type { IPart } from '@social/types/upload.type';
import pLimit from 'p-limit';

export const uploadChunked = async (file: File) => {
  let key: string = '';
  let uploadId: string = '';

  try {
    const dataInit = {
      filename: file.name,
      contentType: file.type,
      fileSize: file.size,
    };
    const initChuckedUpload = await callApiInitChunkedUpload(dataInit);
    if (!initChuckedUpload.data) {
      throw new Error('Khởi tạo upload thất bại');
    }
    key = initChuckedUpload.data.key;
    uploadId = initChuckedUpload.data.uploadId;

    const config = getOptimalChunkConfig(file.size);
    const { chunkSize, concurrency } = config;
    const totalChucks = Math.ceil(file.size / chunkSize);

    const limit = pLimit(concurrency);
    const uploadTasks = [];
    for (let i = 0; i < totalChucks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);
      const partNumber = i + 1;

      const uploadTask = limit(async () => {
        // Lấy presigned URL cho chunk này
        const chunkUrlResponse = await callApiChunkedUpload({
          key,
          uploadId,
          partNumber,
        });

        if (!chunkUrlResponse.data) {
          throw new Error(
            `Không lấy được presigned URL cho part ${partNumber}`
          );
        }

        const url = chunkUrlResponse.data.url;
        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: chunk,
          headers: {
            'Content-Type': file.type,
          },
        });
        if (!uploadResponse.ok) {
          throw new Error(`Không upload được chunk ${partNumber}`);
        }

        // Lấy ETag từ response header
        const etag = uploadResponse.headers.get('ETag')?.replace(/"/g, '');
        if (!etag) {
          throw new Error(`Không lấy được ETag cho part ${partNumber}`);
        }

        return {
          ETag: etag,
          PartNumber: partNumber,
        };
      });
      uploadTasks.push(uploadTask);
    }

    const parts: IPart[] = await Promise.all(uploadTasks);

    // 3. Complete chunked upload
    const completeResponse = await callApiCompleteChunkedUpload({
      key,
      uploadId,
      parts,
    });

    if (!completeResponse.data?.success) {
      throw new Error('Không hoàn thành upload');
    }

    return {
      error: false,
      message: 'Upload thành công',
      data: {
        url: completeResponse.data.url,
        key: completeResponse.data.key,
      },
    };
  } catch (error) {
    console.error('Lỗi upload:', error);

    // Abort upload nếu có lỗi và đã init
    if (key && uploadId) {
      try {
        await callApiAbortChunkedUpload({ key, uploadId });
      } catch (abortError) {
        console.error('Lỗi abort upload:', abortError);
      }
    }

    return {
      error: true,
      message: error instanceof Error ? error.message : 'Upload thất bại',
    };
  }
};

export const smartUpload = async (file: File) => {
  const MB = 1024 * 1024;
  let res;
  if (file.size > 5 * MB) {
    res = await uploadChunked(file);
  } else {
    res = await callApiUploadFile(file);
  }
  if (res.data) {
    return {
      error: false,
      message: 'Upload thành công',
      data: {
        url: res.data.url,
        key: res.data.key,
      },
    };
  }
  return {
    error: true,
    message: res.message,
  };
};

export const getOptimalChunkConfig = (fileSize: number) => {
  const MB = 1024 * 1024;

  if (fileSize < 50 * MB) {
    return { chunkSize: 5 * MB, concurrency: 8 };
  } else if (fileSize < 200 * MB) {
    return { chunkSize: 10 * MB, concurrency: 10 };
  } else if (fileSize < 500 * MB) {
    return { chunkSize: 15 * MB, concurrency: 12 };
  } else if (fileSize < 1024 * MB) {
    return { chunkSize: 20 * MB, concurrency: 10 };
  } else {
    return { chunkSize: 25 * MB, concurrency: 8 };
  }
};
