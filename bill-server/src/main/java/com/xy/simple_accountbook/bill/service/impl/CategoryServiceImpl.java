package com.xy.simple_accountbook.bill.service.impl;

import com.xy.simple_accountbook.bill.common.context.UserContext;
import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import com.xy.simple_accountbook.bill.entity.vo.CategoryVO;
import com.xy.simple_accountbook.bill.mapper.CategoryMapper;
import com.xy.simple_accountbook.bill.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryMapper categoryMapper;

//    public List<CategoryEntity> queryDefaultCategories () {
//        List<CategoryEntity> categoryEntitys = categoryMapper.queryDefaultCategories();
//
//        return categoryEntitys;
//    }

    @Override
    public List<CategoryVO> queryUserCategory() {
        Long userId = UserContext.getUserId();

        List<CategoryEntity> categoryList = categoryMapper.queryUserCategories(userId);

        List<CategoryVO> categoryVoList = categoryList.stream().map(CategoryVO :: transferEntityToCategoryVO).collect(Collectors.toList());
        return categoryVoList;
    }
}
