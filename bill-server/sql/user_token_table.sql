-- bill.user_token 定义
-- Opaque Token 存储表（仅存储 token 的 SHA-256 哈希，不存明文）

CREATE TABLE `user_token` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `token_hash` char(64) NOT NULL COMMENT '令牌SHA-256哈希值（64位十六进制）',
  `user_id` smallint unsigned NOT NULL COMMENT '用户ID',
  `username` varchar(20) NOT NULL COMMENT '用户名（冗余存储，避免关联查询）',
  `expire_time` datetime NOT NULL COMMENT '过期时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_token_hash` (`token_hash`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户访问令牌表';
