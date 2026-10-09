package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import com.xy.simple_accountbook.bill.entity.UserCategoryEntity;
import com.xy.simple_accountbook.bill.entity.vo.CategoryVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {
    CategoryEntity findCategoryById(@Param("id") Long id);

    List<CategoryEntity> queryByIds(@Param("ids") List<Long> ids);

    List<CategoryEntity> queryDefaultCategories();

    List<CategoryVO> queryUserCategories(@Param("userId") Long userId);

    int batchUpdateCategory(@Param("categoryList") List<CategoryEntity> categoryList);
}
