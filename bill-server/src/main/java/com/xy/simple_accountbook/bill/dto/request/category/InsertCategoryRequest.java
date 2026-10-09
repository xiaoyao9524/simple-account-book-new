package com.xy.simple_accountbook.bill.dto.request.category;

import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import com.xy.simple_accountbook.bill.validator.CategoryTitleLength;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InsertCategoryRequest {
    private Long id;

    @NotNull(message = "类型不能为空")
    private CategoryTypeEnum type;

    @NotNull(message = "类别名称不能为空")
    @Size(min = 1, max = 6, message = "类别名称含中文时最多4个字符，不含中文时最多6个字符")
    @CategoryTitleLength
    private String title;

    @NotNull(message = "类别图标不能为空")
    @Size(min = 1, max = 10, message = "类别图标最大长度10个字符")
    private String icon;
}
