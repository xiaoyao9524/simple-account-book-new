package com.xy.simple_accountbook.bill.dto.request.common;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class IdsRequest {
    @NotEmpty(message = "id列表不能为空")
    private List<@NotNull(message = "id列表不能为空")Long> ids;
}
