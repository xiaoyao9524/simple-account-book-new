import type { BaseResult } from './base';
import type { UserInfo } from './user';

export interface SignupRequestProps {
  username: string;
  password: string;
  confirmPassword: string;
}

export type RegisterResponseProps = BaseResult<{
  token: string;
}>;

export interface LoginRequestProps {
  username: string;
  password: string;
}

export type LoginResponseProps = BaseResult<{
  token: string;
}>;

export type LogoutResponseProps = BaseResult<null>;

export type UserInfoResult = BaseResult<UserInfo>;
