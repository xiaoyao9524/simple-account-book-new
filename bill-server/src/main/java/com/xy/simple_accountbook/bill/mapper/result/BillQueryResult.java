package com.xy.simple_accountbook.bill.mapper.result;

import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import com.xy.simple_accountbook.bill.entity.vo.CategoryVO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillQueryResult {
    private Long id;
    private CategoryTypeEnum type;
    private BigDecimal price;
    private String remark;
    private LocalDate date;
    private CategoryVO category;
}
