export interface ILoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}
