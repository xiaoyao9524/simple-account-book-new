package com.xy.simple_accountbook.bill.controller;

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

    @PostMapping("/category/updateUserCategory")
    public BaseResponse<Void> updateUserCategory (@RequestBody @Valid List<CategoryVO> categoryVos) {
        categoryService.updateUserCategory(categoryVos);
        return BaseResponse.success(null);
    }
}
