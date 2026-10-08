export const ResponseCodeEnum = {
  SUCCESS: 200,
  FAIL: 500,
  TOKEN_EXPIRE: 1001
} as const;

export type ResponseCode = typeof ResponseCodeEnum[keyof typeof  ResponseCodeEnum];
