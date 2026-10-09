package com.xy.simple_accountbook.bill.entity.vo;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.xy.simple_accountbook.bill.common.enums.CategoryEnableEnum;
import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import com.xy.simple_accountbook.bill.entity.CategoryEntity;
import com.xy.simple_accountbook.bill.validator.CategoryTitleLength;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@JsonPropertyOrder({"id", "type", "title", "icon", "enable", "sort"})
public class CategoryVO extends BaseVO {
    @NotNull(message = "类别id不能为空")
    private Long id;

    @NotNull(message = "类别不能为空")
    private CategoryTypeEnum type;

    @NotNull(message = "类别名称不能为空")
    @Size(min = 1, max = 6, message = "类别名称含中文时最多4个字符，不含中文时最多6个字符")
    @CategoryTitleLength
    private String title;

    @NotNull(message = "类别图标不能为空")
    @Size(min = 1, max = 10, message = "类别图标最大长度10个字符")
    private String icon;

    @NotNull(message = "类别启用状态不能为空")
    private CategoryEnableEnum enable;

    @NotNull(message = "类别顺序不能为空")
    private Integer sort;

    public static CategoryVO transferEntityToCategoryVO(CategoryEntity categoryEntity) {
        return transferEntityToCategoryVO(categoryEntity, CategoryEnableEnum.ENABLED, 0);
    }

    public static CategoryVO transferEntityToCategoryVO(CategoryEntity categoryEntity, CategoryEnableEnum enable, Integer sort) {
        CategoryVO categoryVO = new CategoryVO();

        categoryVO.setId(categoryEntity.getId());
        categoryVO.setType(categoryEntity.getType());
        categoryVO.setTitle(categoryEntity.getTitle());
        categoryVO.setIcon(categoryEntity.getIcon());

        return categoryVO;
    }
}
