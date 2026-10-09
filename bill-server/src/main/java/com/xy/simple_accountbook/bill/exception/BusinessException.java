package com.xy.simple_accountbook.bill.exception;

import com.xy.simple_accountbook.bill.common.enums.ResponseCodeEnum;

public class BusinessException extends RuntimeException {
    private final int code;

    public BusinessException(ResponseCodeEnum responseCode) {
        super(responseCode.getDesc());
        this.code = responseCode.getCode();
    }

    public BusinessException (ResponseCodeEnum responseCode, String message) {
        super(message);
        this.code = responseCode.getCode();
    }
}
