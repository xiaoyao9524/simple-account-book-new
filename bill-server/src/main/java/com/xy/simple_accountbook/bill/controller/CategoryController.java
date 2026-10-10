package com.xy.simple_accountbook.bill.controller;

import com.xy.simple_accountbook.bill.dto.request.category.InsertCategoryRequest;
import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import com.xy.simple_accountbook.bill.entity.vo.CategoryVO;
import com.xy.simple_accountbook.bill.service.impl.CategoryServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CategoryController {

    @Autowired
    CategoryServiceImpl categoryService;

    @GetMapping("/category/queryUserCategory")
    public BaseResponse<List<CategoryVO>> queryUserCategory() {
        List<CategoryVO> categoryVOList = categoryService.queryUserCategory();
        return BaseResponse.success(categoryVOList);
    }

    @PostMapping("/category/batchUpdateCategory")
    public BaseResponse<Void> batchUpdateCategory (@RequestBody @Valid List<CategoryVO> categoryVos) {
        categoryService.batchUpdateCategory(categoryVos);
        return BaseResponse.success(null);
    }

    @PostMapping("/category/insertCategory")
    public BaseResponse<Void> insertCategory (@RequestBody @Valid InsertCategoryRequest request) {
        categoryService.insertCategory(request);
        return BaseResponse.success(null);
    }
}
