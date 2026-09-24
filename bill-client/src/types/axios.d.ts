import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    custom_handler_err_res?: boolean;
  }

  // interface AxiosInstance {
  //   request<T = any>(config: AxiosRequestConfig): Promise<T>;
  //   get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  //   post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  //   put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  //   delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  // }
}
