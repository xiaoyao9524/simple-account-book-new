package com.xy.simple_accountbook.bill.entity.vo;

import lombok.Data;

@Data
public class LoginVO {
    private String token;
    private UserVO userInfo;

//    public static LoginVO of(String token) {
//        LoginVO loginVO = new LoginVO();
//        loginVO.setToken(token);
//        return loginVO;
//    }
}
