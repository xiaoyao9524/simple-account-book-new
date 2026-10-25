package com.xy.simple_accountbook.bill.service;

import com.xy.simple_accountbook.bill.dto.request.bill.InsertBillRequest;
import com.xy.simple_accountbook.bill.dto.request.bill.TransferCategoryRequest;
import com.xy.simple_accountbook.bill.dto.request.bill.UpdateBillRequest;
import com.xy.simple_accountbook.bill.entity.vo.BillVO;
import com.xy.simple_accountbook.bill.mapper.result.BillQueryResult;

import java.time.YearMonth;
import java.util.List;

public interface BillService {
    void insert (InsertBillRequest bill);
    void update (UpdateBillRequest bill);
    List<BillQueryResult> queryByDateAndUid(YearMonth date);
    Integer batchDelete (List<Long> ids);
    List<BillQueryResult>queryByCategoryId(Long categoryId);
    Boolean transferCategoryId(Long categoryId, Long newCategoryId);
}
