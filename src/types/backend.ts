export interface IBackendRes<T> {
  data: T;
  message: string;
  status: number;
  error: string;
}
