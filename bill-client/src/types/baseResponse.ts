import {ResponseCodeEnum} from '@/enums/responseCodeEnum';

export interface BaseResponse<T> {
  code: ResponseCodeEnum;
  data: T;
  message: string;
}
