package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.IconEntity;
import com.xy.simple_accountbook.bill.entity.UserIconEntity;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface IconMapper {
    List<IconEntity> queryDefaultIcons ();
    Integer batchInsertDefaultIcons(List<UserIconEntity> userIconEntitys);
}
