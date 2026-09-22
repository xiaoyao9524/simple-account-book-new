package com.xy.simple_accountbook.bill.config;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlCommandType;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Signature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.Date;
import java.util.Map;

@Component
@Intercepts({
    @Signature(type = Executor.class, method = "update",
               args = {MappedStatement.class, Object.class})
})
public class MyBatisAutoFillInterceptor implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        MappedStatement ms = (MappedStatement) invocation.getArgs()[0];
        Object parameter = invocation.getArgs()[1];
        SqlCommandType commandType = ms.getSqlCommandType();

        if (parameter == null) {
            return invocation.proceed();
        }

        if (parameter instanceof Map<?, ?> map) {
            for (Object value : map.values()) {
                if (value != null) {
                    autoFill(value, commandType);
                }
            }
        } else {
            autoFill(parameter, commandType);
        }

        return invocation.proceed();
    }

    private void autoFill(Object target, SqlCommandType commandType) {
        if (commandType == SqlCommandType.INSERT) {
            fillField(target, "createTime", new Date());
            fillField(target, "updateTime", new Date());
        } else if (commandType == SqlCommandType.UPDATE) {
            fillField(target, "updateTime", new Date());
        }
    }

    private void fillField(Object target, String fieldName, Date value) {
        Class<?> clazz = target.getClass();
        while (clazz != null) {
            try {
                Field field = clazz.getDeclaredField(fieldName);
                field.setAccessible(true);
                if (field.get(target) == null) {
                    field.set(target, value);
                }
                return;
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            } catch (IllegalAccessException e) {
                return;
            }
        }
    }
}
