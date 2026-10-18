package com.xy.simple_accountbook.bill.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@Data
public class BillUserEntity extends BaseEntity{
    @EqualsAndHashCode.Include
    private Long id;
    private Long billId;
    private Long uId;
}
