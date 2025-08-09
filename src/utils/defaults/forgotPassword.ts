import type { IForgotPasswordForm } from '@social/types/auths.type';

export const DEFAULT_FORGOT_PASSWORD: IForgotPasswordForm = {
  email: '',
  otp: '',
  newPassword: '',
  confirmPassword: '',
};
