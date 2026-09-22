export interface BaseSuccessResult<T> {
  status: 200;
  message: string;
  data: T;
}

type failResultStatus = 500 | 1001 | 1002;

export interface BaseFailResult {
  status: failResultStatus;
  message: string;
}

export type BaseResult<T> = BaseSuccessResult<T> | BaseFailResult;
