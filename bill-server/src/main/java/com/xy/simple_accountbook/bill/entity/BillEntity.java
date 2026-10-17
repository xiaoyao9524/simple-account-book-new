package com.xy.simple_accountbook.bill.entity;

import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class BillEntity extends BaseEntity {
    private Long id;

    private CategoryTypeEnum type;

    private Long categoryId;

    private BigDecimal price;

    private String remark;

    private LocalDate date;
}
