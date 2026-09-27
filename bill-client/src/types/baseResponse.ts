import type { ResponseCode } from '@/enums/responseCodeEnum';

export interface BaseResponse<T> {
  code: ResponseCode;
  data: T;
  message: string;
}
