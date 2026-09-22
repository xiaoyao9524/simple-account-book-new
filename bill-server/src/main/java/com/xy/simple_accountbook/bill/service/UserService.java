package com.xy.simple_accountbook.bill.service;

import com.xy.simple_accountbook.bill.dto.request.user.UserLoginRequest;
import com.xy.simple_accountbook.bill.dto.request.user.UserRegisterRequest;
import com.xy.simple_accountbook.bill.entity.vo.UserVO;

public interface UserService {
    UserVO register(UserRegisterRequest request);

    String login(UserLoginRequest request);
}
