package com.xy.simple_accountbook.bill.handler;

import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(CategoryTypeEnum.class)
@MappedJdbcTypes(JdbcType.TINYINT)
public class CategoryTypeHandler extends BaseTypeHandler<CategoryTypeEnum> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
                                    CategoryTypeEnum parameter, JdbcType jdbcType) throws SQLException {
        ps.setInt(i, parameter.getType());
    }

    @Override
    public CategoryTypeEnum getNullableResult(ResultSet rs, String columnName) throws SQLException {
        int value = rs.getInt(columnName);
        return rs.wasNull() ? null : CategoryTypeEnum.fromValue(value);
    }

    @Override
    public CategoryTypeEnum getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        int value = rs.getInt(columnIndex);
        return rs.wasNull() ? null : CategoryTypeEnum.fromValue(value);
    }

    @Override
    public CategoryTypeEnum getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        int value = cs.getInt(columnIndex);
        return cs.wasNull() ? null : CategoryTypeEnum.fromValue(value);
    }
}