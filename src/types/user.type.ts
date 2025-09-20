export interface IUser {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  cover: string;
  phone: string;
  followers: string[];
  following: string[];
  role: string;
  isActive: boolean;
}

export interface IUserTag {
  id: string;
  name: string;
  avatar: string;
}
