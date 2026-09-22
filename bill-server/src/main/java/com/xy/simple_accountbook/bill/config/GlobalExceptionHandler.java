package com.xy.simple_accountbook.bill.config;

import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public BaseResponse<Void> handleValidationException(MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();
        String message = fieldError != null ? fieldError.getDefaultMessage() : "参数校验失败";
        return BaseResponse.fail(message);
    }

    @ExceptionHandler(RuntimeException.class)
    public BaseResponse<Void> handleRuntimeException(RuntimeException e) {
        return BaseResponse.fail(e.getMessage());
    }
}
