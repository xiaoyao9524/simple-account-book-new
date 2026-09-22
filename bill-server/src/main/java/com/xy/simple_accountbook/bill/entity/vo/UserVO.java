package com.xy.simple_accountbook.bill.entity.vo;

import com.xy.simple_accountbook.bill.entity.UserEntity;
import lombok.Data;

@Data
public class UserVO {
    private Long id;
    private String username;
    private String avatar;

    public static UserVO transferEntityToUserVO (UserEntity userEntity) {
        UserVO userVO = new UserVO();

        userVO.setId(userEntity.getId());
        userVO.setUsername(userEntity.getUsername());
        userVO.setAvatar(userEntity.getAvatar());

        return userVO;
    }
}
