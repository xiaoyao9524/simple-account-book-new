package com.xy.simple_accountbook.bill.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.Date;

@Data
public class BaseEntity {
    private Date createTime;
    private Date updateTime;

    @JsonIgnore
    private Date deletedAt;
}
