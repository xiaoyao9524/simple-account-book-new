package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    Integer register (UserEntity userEntity);
    UserEntity findByUsername (String username);
    UserEntity loginFindByUsername (String username);
}
