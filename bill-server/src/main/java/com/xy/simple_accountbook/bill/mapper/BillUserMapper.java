package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.BillUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BillUserMapper {
    int insert(@Param("billUser") BillUser billUser);
}
