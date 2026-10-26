package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    Integer register (UserEntity userEntity);
    UserEntity findByUsername (String username);
    UserEntity loginFindByUsername (String username);
    UserEntity findByUId(@Param("uId") Long uId);
}
