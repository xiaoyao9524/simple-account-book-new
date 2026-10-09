package com.xy.simple_accountbook.bill.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum CategoryEnableEnum {
    DISABLED(0, "停用"),
    ENABLED(1, "启用");

    @JsonValue
    private final Integer code;
    private final String desc;

    CategoryEnableEnum (Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public static CategoryEnableEnum fromValue(Integer value) {
        if (value == null) {
            return null;
        }
        for (CategoryEnableEnum e : values()) {
            if (e.code.equals(value)) {
                return e;
            }
        }
        throw new IllegalArgumentException("未知的 CategoryEnableEnum 值: " + value);
    }
}
