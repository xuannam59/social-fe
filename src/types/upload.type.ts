export interface IInitChunkedUpload {
  filename: string;
  contentType: string;
  fileSize: number;
}

export interface IChunkedUpload {
  key: string;
  uploadId: string;
  partNumber: number;
}

export interface IPart {
  ETag: string;
  PartNumber: number;
}

export interface ICompleteChunkedUpload {
  key: string;
  uploadId: string;
  parts: Array<IPart>;
}

export interface IAbortChunkedUpload {
  key: string;
  uploadId: string;
}
