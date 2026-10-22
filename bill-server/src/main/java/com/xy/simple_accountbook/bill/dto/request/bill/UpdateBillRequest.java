package com.xy.simple_accountbook.bill.dto.request.bill;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBillRequest extends InsertBillRequest {
    @NotNull(message = "请选择要修改的账单")
    private Long id;
}
