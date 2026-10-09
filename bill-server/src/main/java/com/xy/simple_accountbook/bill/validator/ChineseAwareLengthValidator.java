package com.xy.simple_accountbook.bill.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class ChineseAwareLengthValidator implements ConstraintValidator<ChineseAwareLength, String> {

    private static final Pattern ALLOWED = Pattern.compile("^[\\u4e00-\\u9fa5a-zA-Z0-9]+$");
    private static final Pattern HAS_CHINESE = Pattern.compile(".*[\\u4e00-\\u9fa5].*");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true;  // 空值交给 @NotNull 处理
        }
        if (!ALLOWED.matcher(value).matches()) {
            return false;
        }
        int maxLength = HAS_CHINESE.matcher(value).matches() ? 4 : 6;
        return value.length() <= maxLength;
    }
}
