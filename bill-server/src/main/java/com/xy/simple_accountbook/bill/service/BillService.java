package com.xy.simple_accountbook.bill.service;

import com.xy.simple_accountbook.bill.dto.request.bill.InsertBillRequest;
import com.xy.simple_accountbook.bill.mapper.result.BillQueryResult;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

public interface BillService {
    void insert (InsertBillRequest bill);
    List<BillQueryResult> queryByDateAndUid(YearMonth date);
    Integer batchDelete (List<Long> ids);
}
