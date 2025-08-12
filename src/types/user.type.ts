export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
}
