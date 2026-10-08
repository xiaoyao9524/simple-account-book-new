import { useNavigate } from 'react-router';
import { ResponseCodeEnum } from '@/enums/responseCodeEnum';
// import type {BaseResponse} from '@/types/base'
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import type { BaseResponse } from '@/types/baseResponse'
import { Toast } from 'antd-mobile';

import useTokenStore from '@/store/useTokenStore';
import useUserStore from '@/store/useUserStore';

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 60_000,
});

instance.interceptors.response.use((response: AxiosResponse<BaseResponse<unknown>>) => {
  return response;
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : void 0;
  return config;
})

export async function request<T>(config: AxiosRequestConfig) {
  try {
    const res = await instance<BaseResponse<T>>(config);

    switch (res.data.code) {
      // case ResponseCodeEnum.TOKEN_EXPIRE: {
      //   const clearToken = useTokenStore.getState().clearToken;
      //   const clearUserInfo = useUserStore.getState().clearUserInfo;

      //   clearToken();
      //   clearUserInfo();

      //   break
      // }
      case ResponseCodeEnum.FAIL: {
        if (res.config.custom_handler_err_res) {
          return res.data;
        }
        Toast.show({ content: res.data?.message || '请求失败', icon: 'fail' });
        throw new Error(res.data?.message || '请求失败');
      }
    }

    return res.data;
  } catch (err) {
    console.error('request error: ', err);
  }
}

export default request;
