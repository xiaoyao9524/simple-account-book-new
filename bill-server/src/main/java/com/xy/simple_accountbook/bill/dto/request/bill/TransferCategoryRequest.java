package com.xy.simple_accountbook.bill.dto.request.bill;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransferCategoryRequest {
    @NotNull(message = "新分类不能为空")
    private Long newCategoryId;

    @NotNull(message = "分类不能为空")
    private Long categoryId;
}
