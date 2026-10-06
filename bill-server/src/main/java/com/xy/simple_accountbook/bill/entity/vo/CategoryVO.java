package com.xy.simple_accountbook.bill.entity.vo;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import lombok.Data;

@Data
@JsonPropertyOrder({"id", "type", "title", "icon"})
public class CategoryVO extends BaseVO {
    private Long id;
    private CategoryTypeEnum type;
    private String title;
    private String icon;

    public static CategoryVO transferEntityToCategoryVO(CategoryEntity categoryEntity) {
        CategoryVO categoryVO = new CategoryVO();

        categoryVO.setId(categoryEntity.getId());
        categoryVO.setType(categoryEntity.getType());
        categoryVO.setTitle(categoryEntity.getTitle());
        categoryVO.setIcon(categoryEntity.getIcon());

        return categoryVO;
    }
}
