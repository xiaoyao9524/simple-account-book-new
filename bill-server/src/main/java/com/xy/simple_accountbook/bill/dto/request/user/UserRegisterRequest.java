package com.xy.simple_accountbook.bill.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterRequest {
    @NotBlank(message = "用户名不能为空！")
    @Size(min = 2, max = 8, message = "用户名长度为2-8个字符！")
    private String username;

    @NotBlank(message = "密码不能为空！")
    @Size(min = 8, max = 12, message = "密码长度为8-12个字符！")
    private String password;

}
