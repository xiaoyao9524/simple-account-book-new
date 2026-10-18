package com.xy.simple_accountbook.bill.entity.vo;

import com.xy.simple_accountbook.bill.entity.BillUserEntity;
import lombok.Data;


@Data
public class BillUserVO extends BaseVO {
    private Long id;

    private Long billId;

    private Long uId;

    public static BillUserVO transferEntityToVO (BillUserEntity entity) {
        BillUserVO billUserVO = new BillUserVO();

        billUserVO.setId(entity.getId());
        billUserVO.setBillId(entity.getBillId());
        billUserVO.setUId(entity.getUId());

        return billUserVO;
    }
}
