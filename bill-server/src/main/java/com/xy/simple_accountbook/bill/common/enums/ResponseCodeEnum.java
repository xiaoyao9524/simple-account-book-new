package com.xy.simple_accountbook.bill.common.enums;

import lombok.Getter;

@Getter
public enum ResponseCodeEnum {
    SUCCESS(200, "成功"),
    FAIL(500, "失败");

    private final  Integer code;
    private final  String desc;

    ResponseCodeEnum (Integer code, String desc) {
        this.code = code;
        this.desc = desc;

    }
}
