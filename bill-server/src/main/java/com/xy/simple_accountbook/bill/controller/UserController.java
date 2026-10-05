package com.xy.simple_accountbook.bill.controller;

import com.xy.simple_accountbook.bill.common.context.UserContext;
import com.xy.simple_accountbook.bill.dto.request.user.UserLoginRequest;
import com.xy.simple_accountbook.bill.dto.request.user.UserRegisterRequest;
import com.xy.simple_accountbook.bill.entity.IconEntity;
import com.xy.simple_accountbook.bill.entity.UserIconEntity;
import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import com.xy.simple_accountbook.bill.entity.vo.LoginVO;
import com.xy.simple_accountbook.bill.entity.vo.UserVO;
import com.xy.simple_accountbook.bill.service.UserService;
import com.xy.simple_accountbook.bill.service.impl.IconServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/user/register")
    public BaseResponse<UserVO> register(@Valid @RequestBody UserRegisterRequest request) {
        UserVO userVO = userService.register(request);

        return BaseResponse.success(userVO);
    }

    @PostMapping("/user/login")
    public BaseResponse<LoginVO> login(@Valid @RequestBody UserLoginRequest request) {
        LoginVO loginVO = userService.login(request);
        return BaseResponse.success(loginVO);
    }

    @PostMapping("/user/logout")
    public BaseResponse<Void> logout(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        userService.logout(token);
        return BaseResponse.success(null);
    }

    @GetMapping("/user/test")
    public BaseResponse<String> test() {
        Long id = UserContext.getUserId();

//        return userService.insertDefaultIcons(id);

        return BaseResponse.success("success, 当前用户：" + UserContext.getUsername());
//        return BaseResponse.success(userService.insertDefaultIcons(id));
    }
}
