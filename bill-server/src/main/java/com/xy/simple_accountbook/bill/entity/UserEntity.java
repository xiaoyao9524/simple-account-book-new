package com.xy.simple_accountbook.bill.entity;

import lombok.Data;

@Data
public class UserEntity extends BaseEntity {
    private Long id;
    private String username;
    private String password;
    private String avatar;
}
