export const ResponseCodeEnum = {
  SUCCESS: 200,
  FAIL: 500
} as const;

export type ResponseCode = typeof ResponseCodeEnum[keyof typeof  ResponseCodeEnum];
