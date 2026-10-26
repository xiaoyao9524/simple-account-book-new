package com.xy.simple_accountbook.bill.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class BaseEntity {
    private LocalDateTime createTime;
    private LocalDateTime  updateTime;

    @JsonIgnore
    private LocalDateTime deletedAt;
}
