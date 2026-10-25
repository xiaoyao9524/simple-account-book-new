package com.xy.simple_accountbook.bill.dto.request.bill;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeleteBillAndCategoryRequest {
    @NotNull(message = "分类不能为空")
    private Long categoryId;
}
