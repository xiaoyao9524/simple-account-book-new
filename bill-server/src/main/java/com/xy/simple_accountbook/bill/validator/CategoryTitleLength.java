package com.xy.simple_accountbook.bill.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CategoryTitleLengthValidator.class)
public @interface CategoryTitleLength {
    String message() default "类别名称含中文时最多4个字符，不含中文时最多6个字符";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
