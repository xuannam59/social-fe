export interface IBackendRes<T> {
  data: T;
  message: string;
  statusCode: number;
  error?: string | string[];
}

export interface IBackendResPagination<T> {
  data: {
    list: T[];
    meta: {
      page: number;
      limit: number;
      total: number;
    };
  };
  message: string;
  statusCode: number;
  error?: string | string[];
}
