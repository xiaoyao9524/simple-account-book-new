package com.xy.simple_accountbook.bill.entity;

import lombok.Data;

import java.util.Date;

@Data
public class TokenEntity {
    private Long id;
    private String tokenHash;
    private Long userId;
    private String username;
    private Date expireTime;
    private Date createTime;
}
