package com.xy.simple_accountbook.bill.common.enums;

import lombok.Getter;

@Getter
public enum ResponseCodeEnum {
    SUCCESS(200, "成功"),
    BUSINESS_ERROR(400, "业务异常"),
    FAIL(500, "失败"),
    TOKEN_EXPIRE(1001, "token已过期");

    private final  int code;
    private final  String desc;

    ResponseCodeEnum (Integer code, String desc) {
        this.code = code;
        this.desc = desc;

    }
}
