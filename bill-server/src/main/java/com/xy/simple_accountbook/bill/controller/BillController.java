package com.xy.simple_accountbook.bill.controller;

import com.xy.simple_accountbook.bill.dto.request.bill.InsertBillRequest;
import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import com.xy.simple_accountbook.bill.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class BillController {
    private final BillService billService;

    @PostMapping("/bill/insert")
    public BaseResponse<Void> insert(@RequestBody @Valid InsertBillRequest request) {
        billService.insert(request);
        return BaseResponse.success(null);
    }
}
