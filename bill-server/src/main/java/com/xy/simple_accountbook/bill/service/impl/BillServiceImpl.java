package com.xy.simple_accountbook.bill.service.impl;

import com.xy.simple_accountbook.bill.common.context.UserContext;
import com.xy.simple_accountbook.bill.common.enums.ResponseCodeEnum;
import com.xy.simple_accountbook.bill.dto.request.bill.InsertBillRequest;
import com.xy.simple_accountbook.bill.entity.BillEntity;
import com.xy.simple_accountbook.bill.entity.BillUser;
import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import com.xy.simple_accountbook.bill.exception.BusinessException;
import com.xy.simple_accountbook.bill.mapper.BillMapper;
import com.xy.simple_accountbook.bill.mapper.BillUserMapper;
import com.xy.simple_accountbook.bill.service.BillService;
import com.xy.simple_accountbook.bill.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {

    private final BillMapper billMapper;
    private final BillUserMapper billUserMapper;
    private final CategoryService categoryService;

    @Transactional(rollbackFor = Exception.class)
    public void insert (InsertBillRequest bill) {
        Long uId = UserContext.getUserId();

        CategoryEntity categoryEntity = categoryService.findCategoryById(bill.getCategoryId());

        if (categoryEntity == null || (categoryEntity.getUId() != null && !categoryEntity.getUId().equals(uId))) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "分类不存在");
        }

        BillEntity billEntity = new BillEntity();

        billEntity.setType(bill.getType());
        billEntity.setCategoryId(bill.getCategoryId());
        billEntity.setPrice(bill.getPrice());
        billEntity.setDate(bill.getDate());
        String remark = bill.getRemark();
        billEntity.setRemark(remark == null?  "" : remark);

        int affected = billMapper.insert(billEntity);

        if (affected == 0) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "插入失败");
        }

        BillUser billUser = new BillUser();

        billUser.setBillId(billEntity.getId());
        billUser.setUId(uId);

        int billUserAffected = billUserMapper.insert(billUser);

        if (billUserAffected == 0) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "插入失败");
        }
    }
}
