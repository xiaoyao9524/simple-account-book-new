package com.xy.simple_accountbook.bill.entity.vo;

import com.xy.simple_accountbook.bill.common.enums.ResponseCodeEnum;
import lombok.Data;

@Data
public class BaseResponse<T> {
    private Integer code;
    private String message;
    private T data;

    public static <T> BaseResponse<T> success (T data) {
        BaseResponse<T> baseResponse = new BaseResponse<T>();

        baseResponse.setCode(ResponseCodeEnum.SUCCESS.getCode());

        baseResponse.setMessage(ResponseCodeEnum.SUCCESS.getDesc());

        baseResponse.setData(data);

        return baseResponse;
    }

    public static BaseResponse fail () {
        return fail(ResponseCodeEnum.FAIL.getDesc());
    }

    public static BaseResponse fail (String message) {
        BaseResponse baseResponse = new BaseResponse();

        baseResponse.setCode(ResponseCodeEnum.FAIL.getCode());

        baseResponse.setMessage(message);

        return baseResponse;
    }

    public static BaseResponse tokenExpire (String message) {
        BaseResponse baseResponse = new BaseResponse();

        baseResponse.setCode(ResponseCodeEnum.TOKEN_EXPIRE.getCode());

        baseResponse.setMessage(message);

        return baseResponse;
    }
}
