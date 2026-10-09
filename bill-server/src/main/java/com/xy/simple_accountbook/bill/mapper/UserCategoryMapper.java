package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.UserCategoryEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserCategoryMapper {
    int batchInsertDefaultCategories(@Param("list") List<UserCategoryEntity> userCategoryEntitys);
    UserCategoryEntity findByCategoryIdAndUid (@Param("categoryId") Long categoryId, @Param("uId") Long uId);
    List<UserCategoryEntity> queryByCategoryIdsAndUid(@Param("categoryIds") List<Long> categoryIds, @Param("uId") Long uId);
    int batchUpdateUserCategory(@Param("categoryList") List<UserCategoryEntity> categoryList);
}
