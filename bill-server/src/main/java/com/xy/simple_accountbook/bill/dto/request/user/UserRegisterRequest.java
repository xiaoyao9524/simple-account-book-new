package com.xy.simple_accountbook.bill.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterRequest {
    @NotBlank(message = "用户名不能为空！")
    @Size(min = 2, max = 8, message = "用户名长度为2-8个字符！")
    @Pattern(
            regexp = "^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]{1,7}$",
            message = "用户名必须以字母或汉字开头，只能包含字母、汉字、数字，长度2~8"
    )
    private String username;

    @NotBlank(message = "密码不能为空！")
    @Size(min = 8, max = 12, message = "密码长度为8-12个字符！")
    private String password;

}
