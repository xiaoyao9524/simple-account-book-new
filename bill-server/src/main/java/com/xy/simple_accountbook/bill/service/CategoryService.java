package com.xy.simple_accountbook.bill.service;

import com.xy.simple_accountbook.bill.entity.vo.CategoryVO;

import java.util.List;

public interface CategoryService {
    List<CategoryVO> queryUserCategory();
}
