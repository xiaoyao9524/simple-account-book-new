package com.xy.simple_accountbook.bill.controller;

import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import com.xy.simple_accountbook.bill.entity.vo.CategoryVO;
import com.xy.simple_accountbook.bill.service.impl.CategoryServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CategoryController {

    @Autowired
    CategoryServiceImpl categoryService;

//    @GetMapping("/category/queryDefaultCategoryList")
//    public BaseResponse<List<CategoryVO>> queryDefaultCategoryList() {
//         List<CategoryEntity> categoryEntitys = categoryService.queryDefaultCategories();
//
//         List<CategoryVO> categoryVos = categoryEntitys.stream().map(CategoryVO::transferEntityToCategoryVO).collect(Collectors.toList());
//
//         return BaseResponse.success(categoryVos);
//    }

    @GetMapping("/category/queryUserCategory")
    public BaseResponse<List<CategoryVO>> queryUserCategory() {
        List<CategoryVO> categoryVOList = categoryService.queryUserCategory();
        return BaseResponse.success(categoryVOList);
    }
}
