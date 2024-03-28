interface UserBase {
  phone: string;
  password: string;
}

export interface User extends UserBase {
  name: string;
  signImg: string;
  isAdmin?: boolean;
  id: string;
  jwt: string;
}

export interface LoginPayload extends UserBase {}

export interface RegistrationPayload extends UserBase {
  name: string;
  signImg: string;
  isAdmin?: boolean;
}
