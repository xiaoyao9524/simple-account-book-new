import request from './request';
import type {
  SignupRequestProps,
  RegisterResponseProps,
  LoginRequestProps,
  LoginResponseProps,
  UserInfoResult,
  LogoutResponseProps,
} from '@/types/admin';

export const register = (data: SignupRequestProps) =>
  request<RegisterResponseProps>({
    method: 'post',
    url: '/api/admin/register',
    data,
  });

export function login(data: LoginRequestProps) {
  return request<LoginResponseProps>({
    method: 'post',
    url: '/api/admin/login',
    data,
  });
}

export function getUserInfo() {
  return request<UserInfoResult>({
    method: 'post',
    url: '/api/admin/getUserInfo',
  });
}

export function logout() {
  return request<LogoutResponseProps>({
    method: 'post',
    url: '/api/admin/logout',
  });
}
