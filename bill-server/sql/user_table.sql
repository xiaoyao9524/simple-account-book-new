-- bill.`user` 定义

create table `user` (
  `id` bigint unsigned not null auto_increment,
`username` varchar(20) not null,
`password` longtext character set utf8mb3 collate utf8mb3_general_ci not null,
`create_time` datetime not null default CURRENT_TIMESTAMP COMMENT '用户创建时间',
`update_time` datetime not null default CURRENT_TIMESTAMP on
update
    CURRENT_TIMESTAMP COMMENT '数据修改时间',
    `avatar` longtext,
    primary key (`id`),
    unique key `username` (`username`)
) engine = InnoDB auto_increment = 5 default CHARSET = utf8mb3;
