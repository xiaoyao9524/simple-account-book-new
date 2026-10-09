package com.xy.simple_accountbook.bill.entity;

import com.xy.simple_accountbook.bill.common.enums.CategoryEnableEnum;
import lombok.Data;

@Data
public class UserCategoryEntity extends BaseEntity{
    private Long id;
    private Long uId;
    private Long categoryId;
    private CategoryEnableEnum enable;
    private Integer sort;
}
