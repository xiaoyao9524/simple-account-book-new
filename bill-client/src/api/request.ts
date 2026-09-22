import axios from 'axios';

const service = axios.create({
  timeout: 60_000,
});

service.interceptors.response.use((response) => {
  switch (response.data?.status) {
    case 1001:
    case 1002:
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      window.location.href = `/login?redirect=${
        window.location.pathname
      }&failMsg=${encodeURIComponent(response.data.message)}`;
      break;
  }
  return response;
});

export async function request<T>(config: Parameters<typeof service['request']>[0]): Promise<T> {
  const response = await service(config);
  return response.data as T;
}

export default request;
