package com.xy.simple_accountbook.bill.handler;

import com.xy.simple_accountbook.bill.common.enums.CategoryEnableEnum;
import com.xy.simple_accountbook.bill.common.enums.CategoryTypeEnum;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(CategoryEnableEnum.class)
@MappedJdbcTypes(JdbcType.TINYINT)
public class UserCategoryEnableHandler extends BaseTypeHandler<CategoryEnableEnum> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i,
                                    CategoryEnableEnum parameter, JdbcType jdbcType) throws SQLException {
        ps.setInt(i, parameter.getCode());
    }

    @Override
    public CategoryEnableEnum getNullableResult(ResultSet rs, String columnName) throws SQLException {
        int value = rs.getInt(columnName);
        return rs.wasNull() ? null : CategoryEnableEnum.fromValue(value);
    }

    @Override
    public CategoryEnableEnum getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        int value = rs.getInt(columnIndex);
        return rs.wasNull() ? null : CategoryEnableEnum.fromValue(value);
    }

    @Override
    public CategoryEnableEnum getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        int value = cs.getInt(columnIndex);
        return cs.wasNull() ? null : CategoryEnableEnum.fromValue(value);
    }
}