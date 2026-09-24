package com.xy.simple_accountbook.bill.mapper;

import com.xy.simple_accountbook.bill.entity.TokenEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TokenMapper {
    void insert(TokenEntity tokenEntity);
    TokenEntity findByTokenHash(String tokenHash);
    void deleteByTokenHash(String tokenHash);
    void deleteExpiredTokens();
}
