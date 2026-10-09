package com.xy.simple_accountbook.bill.config;

import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.validation.method.ParameterValidationResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 处理 @RequestBody @Valid 校验失败 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));
        if (message.isEmpty()) {
            message = "参数校验失败";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.fail(message));
    }

    /** 处理 @Valid List<T> / @ModelAttribute 校验失败 */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<BaseResponse<Void>> handleBindException(BindException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));
        if (message.isEmpty()) {
            message = "参数校验失败";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.fail(message));
    }

    /** 处理 @RequestParam / @PathVariable 校验失败 */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<BaseResponse<Void>> handleConstraintViolation(ConstraintViolationException e) {
        String message = e.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .collect(Collectors.joining("; "));
        if (message.isEmpty()) {
            message = "参数校验失败";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.fail(message));
    }

    /** 请求体无法解析（JSON 格式错误 / 缺少 body） */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<BaseResponse<Void>> handleNotReadable(HttpMessageNotReadableException e) {
        // 打印实际异常，方便定位
        System.out.println("========== HttpMessageNotReadableException: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.fail("请求体格式不正确或为空"));
    }

    /** 处理 @Valid 标注在方法参数上的校验失败（Spring 6.x 方法级别校验） */
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<BaseResponse<Void>> handleHandlerMethodValidation(HandlerMethodValidationException e) {
        StringBuilder sb = new StringBuilder();
        for (ParameterValidationResult result : e.getParameterValidationResults()) {
            String paramName = result.getMethodParameter().getParameterName();
            // getContainerIndex() 返回列表元素的索引（如 List<CategoryVO> 校验时）
            Integer index = result.getContainerIndex();
            String field = (index != null) ? paramName + "[" + index + "]" : paramName;

            for (MessageSourceResolvable resolvable : result.getResolvableErrors()) {
                if (!sb.isEmpty()) {
                    sb.append("; ");
                }
                sb.append(field).append(": ").append(resolvable.getDefaultMessage());
            }
        }
        String message = sb.toString();
        if (message.isEmpty()) {
            message = "参数校验失败";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(BaseResponse.fail(message));
    }

    /** 业务异常 / 运行时异常 */
    @ExceptionHandler(RuntimeException.class)
    public BaseResponse<Void> handleRuntimeException(RuntimeException e) {
        // 打印异常类名，方便定位是哪种异常走到了这里
        System.out.println("========== RuntimeException 实际类型: " + e.getClass().getName());
        System.out.println("========== Message: " + e.getMessage());
        if (e.getCause() != null) {
            System.out.println("========== Cause: " + e.getCause().getClass().getName() + " - " + e.getCause().getMessage());
        }

        // 尝试从异常链中提取校验错误
        Throwable current = e;
        while (current != null) {
            if (current instanceof MethodArgumentNotValidException manve) {
                String detail = manve.getBindingResult().getFieldErrors().stream()
                        .map(err -> err.getField() + ": " + err.getDefaultMessage())
                        .collect(Collectors.joining("; "));
                if (!detail.isEmpty()) {
                    return BaseResponse.fail(detail);
                }
            }
            if (current instanceof BindException be) {
                String detail = be.getBindingResult().getFieldErrors().stream()
                        .map(err -> err.getField() + ": " + err.getDefaultMessage())
                        .collect(Collectors.joining("; "));
                if (!detail.isEmpty()) {
                    return BaseResponse.fail(detail);
                }
            }
            if (current instanceof ConstraintViolationException cve) {
                String detail = cve.getConstraintViolations().stream()
                        .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                        .collect(Collectors.joining("; "));
                if (!detail.isEmpty()) {
                    return BaseResponse.fail(detail);
                }
            }
            current = current.getCause();
        }

        // 清理 Spring 内部异常的原始 message
        String message = e.getMessage();
        if (message != null && message.matches(".*Validation failure.*")) {
            message = "请求参数校验失败，请检查必填字段是否完整";
        }
        if (message == null || message.isBlank()) {
            message = "服务器内部错误";
        }
        return BaseResponse.fail(message);
    }

    /** 兜底 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse<Void>> handleAll(Exception e) {
        System.out.println("========== 兜底异常 实际类型: " + e.getClass().getName());
        System.out.println("========== Message: " + e.getMessage());
        return ResponseEntity.status(500)
                .body(BaseResponse.fail("服务器内部错误，请稍后重试"));
    }
}
