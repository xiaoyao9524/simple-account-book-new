package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.BillEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BillMapper {
    int insert (@Param("bill") BillEntity bill);
}
