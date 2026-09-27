package com.xy.simple_accountbook.bill.service;

import com.xy.simple_accountbook.bill.entity.TokenEntity;

/**
 * Opaque Token 服务接口
 * 使用随机生成的不透明令牌，数据库中仅存储令牌的 SHA-256 哈希值。
 * 令牌本身不携带任何用户信息，需要通过数据库查询来验证令牌并获取用户信息。
 * 支持令牌吊销（logout）。
 */
public interface TokenService {

    /**
     * 生成不透明令牌，返回明文令牌给前端，数据库中仅存储哈希值
     *
     * @param userId   用户 ID
     * @param username 用户名
     * @return 明文令牌（返回给前端）
     */
    String generateToken(Long userId, String username);

    /**
     * 验证令牌并返回令牌信息
     * 如果令牌无效或已过期，返回 null
     *
     * @param token 明文令牌
     * @return 令牌实体，无效或过期返回 null
     */
    TokenEntity validateToken(String token);

    /**
     * 吊销令牌（登出）
     *
     * @param token 明文令牌
     */
    void revokeToken(String token);

    /**
     * 清理所有过期令牌
     */
    void cleanExpiredTokens();
}