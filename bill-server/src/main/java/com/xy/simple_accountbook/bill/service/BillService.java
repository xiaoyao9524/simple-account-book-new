package com.xy.simple_accountbook.bill.service;

import com.xy.simple_accountbook.bill.dto.request.bill.InsertBillRequest;

public interface BillService {
    void insert (InsertBillRequest bill);
}
