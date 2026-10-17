package com.xy.simple_accountbook.bill.dto.request.bill;

import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InsertBillRequest {
    @NotNull(message = "类型不能为空")
    private CategoryTypeEnum type;

    @NotNull(message = "分类不能为空")
    private Long categoryId;

    @NotNull(message = "金额不能为空")
    private BigDecimal price;

    @NotNull(message = "日期不能为空")
    private LocalDate date;

    private String remark;
}
