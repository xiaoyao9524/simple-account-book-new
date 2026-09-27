package com.xy.simple_accountbook.bill.entity.vo;

import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import com.xy.simple_accountbook.bill.entity.IconEntity;
import lombok.Data;

import java.util.List;

@Data
public class IconVO extends BaseVO {
    private Long id;
//    private Long uId;
    private String title;
    private String icon;
    private CategoryTypeEnum type;

    public static IconVO transferEntityToIconVO(IconEntity iconEntity) {
        IconVO iconVO = new IconVO();

        iconVO.setId(iconEntity.getId());
        iconVO.setTitle(iconEntity.getTitle());
        iconVO.setIcon(iconEntity.getIcon());
        iconVO.setType(iconEntity.getType());

        return iconVO;
    }
}
