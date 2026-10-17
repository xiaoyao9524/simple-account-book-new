package com.xy.simple_accountbook.bill.entity;

import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CategoryEntity extends BaseEntity {
    private Long id;
    private Long uId;
    private String title;
    private String icon;
    private CategoryTypeEnum type;
}
