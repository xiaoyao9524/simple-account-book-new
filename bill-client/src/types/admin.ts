import type { BaseResult } from './base';
import type { BaseResponse } from './baseResponse';
import type { UserVO } from './user';

export interface SignupRequestProps {
  username: string;
  password: string;
}

export type RegisterResponseProps = BaseResponse<{
  token: string;
}>;

export interface LoginRequestProps {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userInfo: UserVO;
}

export type UserInfoResult = BaseResult<UserVO>;
