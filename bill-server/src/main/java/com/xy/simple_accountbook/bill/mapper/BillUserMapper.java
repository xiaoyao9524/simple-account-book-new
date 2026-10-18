package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.BillUserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BillUserMapper {
    int insert(@Param("billUserEntity") BillUserEntity billUserEntity);

    List<BillUserEntity> queryByUId(@Param("uId") Long uId);
}
