package com.xy.simple_accountbook.bill.service.impl;

import com.xy.simple_accountbook.bill.common.utils.PasswordUtils;
import com.xy.simple_accountbook.bill.service.TokenService;
import com.xy.simple_accountbook.bill.dto.request.user.UserLoginRequest;
import com.xy.simple_accountbook.bill.dto.request.user.UserRegisterRequest;
import com.xy.simple_accountbook.bill.entity.UserEntity;
import com.xy.simple_accountbook.bill.entity.vo.LoginVO;
import com.xy.simple_accountbook.bill.entity.vo.UserVO;
import com.xy.simple_accountbook.bill.mapper.UserMapper;
import com.xy.simple_accountbook.bill.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordUtils passwordUtils;

    @Autowired
    private TokenService tokenService;

    @Override
    public UserVO register(UserRegisterRequest request) {
        UserEntity existingUser = userMapper.findByUsername(request.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(request.getUsername());
        userEntity.setPassword(passwordUtils.encrypt(request.getPassword()));
        userEntity.setAvatar("");

        userMapper.register(userEntity);

        return UserVO.transferEntityToUserVO(userEntity);
    }

    @Override
    public LoginVO login(UserLoginRequest request) {
        UserEntity user = userMapper.loginFindByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        if (!passwordUtils.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        String token = tokenService.generateToken(user.getId(), user.getUsername());
        UserVO userInfo = UserVO.transferEntityToUserVO(user);

        LoginVO loginVO = new LoginVO();

        loginVO.setToken(token);
        loginVO.setUserInfo(userInfo);
        return loginVO;
    }

    @Override
    public void logout(String token) {
        tokenService.revokeToken(token);
    }
}
