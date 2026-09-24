import request from './request';
import type {
  SignupRequestProps,
  LoginRequestProps,
  LoginResponse,
  LogoutResponseProps,
} from '@/types/admin';

export const register = (data: SignupRequestProps) =>
  request({
    method: 'post',
    url: '/user/register',
    data,
  });

export function login(data: LoginRequestProps) {
  return request<LoginResponse>({
    method: 'post',
    url: '/user/login',
    data
  });
}

export function logout() {
  return request<LogoutResponseProps>({
    method: 'post',
    url: '/admin/logout',
  });
}
