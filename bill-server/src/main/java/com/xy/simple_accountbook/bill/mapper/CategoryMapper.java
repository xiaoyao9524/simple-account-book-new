package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import com.xy.simple_accountbook.bill.dto.request.category.InsertCategoryRequest;
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

    Long insertCategory(@Param("uId")Long uId, @Param("category") InsertCategoryRequest category);

    int batchUpdateCategory(@Param("categoryList") List<CategoryEntity> categoryList);

    int countByTitleTypeAndUIdOrSystem(@Param("uId") Long uId, @Param("title") String title, @Param("type")CategoryTypeEnum type);
}
