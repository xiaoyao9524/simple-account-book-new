package com.xy.simple_accountbook.bill.controller;

import com.xy.simple_accountbook.bill.dto.request.bill.InsertBillRequest;
import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import com.xy.simple_accountbook.bill.entity.vo.BillVO;
import com.xy.simple_accountbook.bill.mapper.result.BillQueryResult;
import com.xy.simple_accountbook.bill.service.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class BillController {
    private final BillService billService;

    @PostMapping("/bill/insert")
    public BaseResponse<Void> insert(@RequestBody @Valid InsertBillRequest request) {
        billService.insert(request);
        return BaseResponse.success(null);
    }

    @GetMapping("/bill/list")
    public BaseResponse<List<BillQueryResult>> list (@RequestParam YearMonth date) {
        List<BillQueryResult> list = billService.queryByDateAndUid(date);
        return BaseResponse.success(list);
    }
}
