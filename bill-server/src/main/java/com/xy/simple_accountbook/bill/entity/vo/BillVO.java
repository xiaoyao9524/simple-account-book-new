package com.xy.simple_accountbook.bill.entity.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import com.xy.simple_accountbook.bill.entity.BillEntity;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillVO extends BaseVO {
    private Long id;

    private CategoryTypeEnum type;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private BigDecimal price;

    private String remark;

    private LocalDate date;

    private CategoryVO category;

    public static BillVO transferEntityToVO(BillEntity billEntity, CategoryVO categoryVO) {
        BillVO billVO = new BillVO();

        billVO.setId(billEntity.getId());
        billVO.setType(billEntity.getType());
        billVO.setCategory(categoryVO);
        billVO.setPrice(billEntity.getPrice());
        if (billEntity.getRemark() != null) {
            billVO.setRemark(billEntity.getRemark());
        }
        billVO.setDate(billEntity.getDate());
        return billVO;
    }
}
