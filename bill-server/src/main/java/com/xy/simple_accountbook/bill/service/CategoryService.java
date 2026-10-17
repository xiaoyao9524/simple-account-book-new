package com.xy.simple_accountbook.bill.service;

import com.xy.simple_accountbook.bill.dto.request.category.InsertCategoryRequest;
import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import com.xy.simple_accountbook.bill.entity.vo.CategoryVO;

import java.util.List;

public interface CategoryService {
    List<CategoryVO> queryUserCategory();
    CategoryEntity findCategoryById(Long id);
    void insertCategory(InsertCategoryRequest category);
    void batchUpdateCategory(List<CategoryVO> categoryVos);
    void batchDeleteCategory(List<Long> delIds);
}
