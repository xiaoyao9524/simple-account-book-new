package com.xy.simple_accountbook.bill.service.impl;

import com.xy.simple_accountbook.bill.common.context.UserContext;
import com.xy.simple_accountbook.bill.common.enums.ResponseCodeEnum;
import com.xy.simple_accountbook.bill.dto.request.bill.InsertBillRequest;
import com.xy.simple_accountbook.bill.entity.BillEntity;
import com.xy.simple_accountbook.bill.entity.BillUserEntity;
import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import com.xy.simple_accountbook.bill.entity.vo.BillVO;
import com.xy.simple_accountbook.bill.exception.BusinessException;
import com.xy.simple_accountbook.bill.mapper.BillMapper;
import com.xy.simple_accountbook.bill.mapper.BillUserMapper;
import com.xy.simple_accountbook.bill.mapper.result.BillQueryResult;
import com.xy.simple_accountbook.bill.service.BillService;
import com.xy.simple_accountbook.bill.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {

    private final BillMapper billMapper;
    private final BillUserMapper billUserMapper;
    private final CategoryService categoryService;

    public List<BillQueryResult> queryByDateAndUid (YearMonth yearMonth) {
        Long uId = UserContext.getUserId();
//        YearMonth yearMonth = YearMonth.from(date);

        String start = yearMonth.atDay(1).format(DateTimeFormatter.ISO_LOCAL_DATE);
        String end = yearMonth.plusMonths(1).atDay(1).format(DateTimeFormatter.ISO_LOCAL_DATE);

        return billMapper.queryByDateAndUid(start, end, uId);
    }

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

        BillUserEntity billUserEntity = new BillUserEntity();

        billUserEntity.setBillId(billEntity.getId());
        billUserEntity.setUId(uId);

        int billUserAffected = billUserMapper.insert(billUserEntity);

        if (billUserAffected == 0) {
            throw new BusinessException(ResponseCodeEnum.BUSINESS_ERROR, "插入失败");
        }
    }
}
