package com.xy.simple_accountbook.bill.service;

import com.xy.simple_accountbook.bill.entity.TokenEntity;
import com.xy.simple_accountbook.bill.mapper.TokenMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;

/**
 * Opaque Token 服务
 * 使用随机生成的不透明令牌，数据库中仅存储令牌的 SHA-256 哈希值。
 * 令牌本身不携带任何用户信息，需要通过数据库查询来验证令牌并获取用户信息。
 * 支持令牌吊销（logout）。
 */
@Service
public class TokenService {

    private static final int TOKEN_BYTE_LENGTH = 32; // 256位随机数，Base64后约43字符

    private final TokenMapper tokenMapper;
    private final long expireTimeMs;
    private final SecureRandom secureRandom = new SecureRandom();

    public TokenService(TokenMapper tokenMapper,
                        @Value("${app.token.expire-hours:24}") int expireHours) {
        this.tokenMapper = tokenMapper;
        this.expireTimeMs = (long) expireHours * 60 * 60 * 1000;
    }

    /**
     * 生成不透明令牌，返回明文令牌给前端，数据库中仅存储哈希值
     */
    public String generateToken(Long userId, String username) {
        String token = generateRandomToken();
        String tokenHash = sha256(token);
        Date now = new Date();
        Date expire = new Date(now.getTime() + expireTimeMs);

        TokenEntity tokenEntity = new TokenEntity();
        tokenEntity.setTokenHash(tokenHash);
        tokenEntity.setUserId(userId);
        tokenEntity.setUsername(username);
        tokenEntity.setExpireTime(expire);
        tokenEntity.setCreateTime(now);

        tokenMapper.insert(tokenEntity);
        return token;
    }

    /**
     * 验证令牌并返回令牌信息
     * 如果令牌无效或已过期，返回 null
     */
    public TokenEntity validateToken(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }
        String tokenHash = sha256(token);
        TokenEntity tokenEntity = tokenMapper.findByTokenHash(tokenHash);
        if (tokenEntity == null) {
            return null;
        }
        // 检查是否过期
        if (tokenEntity.getExpireTime().before(new Date())) {
            // 过期则删除
            tokenMapper.deleteByTokenHash(tokenHash);
            return null;
        }
        return tokenEntity;
    }

    /**
     * 吊销令牌（登出）
     */
    public void revokeToken(String token) {
        if (token != null && !token.isEmpty()) {
            tokenMapper.deleteByTokenHash(sha256(token));
        }
    }

    /**
     * 清理所有过期令牌
     */
    public void cleanExpiredTokens() {
        tokenMapper.deleteExpiredTokens();
    }

    private String generateRandomToken() {
        byte[] randomBytes = new byte[TOKEN_BYTE_LENGTH];
        secureRandom.nextBytes(randomBytes);
        // 使用 URL 安全的 Base64 编码，去掉填充字符
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    /**
     * 计算字符串的 SHA-256 哈希值，返回小写十六进制字符串（64字符）
     */
    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 哈希计算失败", e);
        }
    }
}
