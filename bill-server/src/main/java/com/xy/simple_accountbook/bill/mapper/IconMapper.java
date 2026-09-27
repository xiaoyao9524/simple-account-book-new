package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.IconEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IconMapper {
    List<IconEntity> queryDefaultIcons ();
}
