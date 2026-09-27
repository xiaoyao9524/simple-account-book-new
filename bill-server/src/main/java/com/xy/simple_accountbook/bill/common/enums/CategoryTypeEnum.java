package com.xy.simple_accountbook.bill.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum CategoryTypeEnum {
    INCOME(1, "收入"),
    EXPEND(0, "支出");

    @JsonValue
    private final Integer type;
    private final String desc;

    CategoryTypeEnum (Integer type, String desc) {
        this.type = type;
        this.desc = desc;
    }

    public static CategoryTypeEnum fromValue(Integer value) {
        if (value == null) {
            return null;
        }
        for (CategoryTypeEnum e : values()) {
            if (e.type.equals(value)) {
                return e;
            }
        }
        throw new IllegalArgumentException("未知的 CategoryTypeEnum 值: " + value);
    }
}
