package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import com.xy.simple_accountbook.bill.entity.UserCategoryEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {
    List<CategoryEntity> queryDefaultCategories ();
    Integer batchInsertDefaultCategories(@Param("list") List<UserCategoryEntity> userCategoryEntitys);
    List<CategoryEntity> queryUserCategories(@Param("userId") Long userId);
}
