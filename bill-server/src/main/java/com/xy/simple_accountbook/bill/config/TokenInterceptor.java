package com.xy.simple_accountbook.bill.config;

import com.xy.simple_accountbook.bill.common.context.UserContext;
import com.xy.simple_accountbook.bill.entity.TokenEntity;
import com.xy.simple_accountbook.bill.entity.vo.BaseResponse;
import com.xy.simple_accountbook.bill.service.TokenService;
import tools.jackson.databind.json.JsonMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class TokenInterceptor implements HandlerInterceptor {

    private final JsonMapper jsonMapper = new JsonMapper();

    private final TokenService tokenService;

    public TokenInterceptor(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // CORS 预检请求直接放行
//        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
//            return true;
//        }

        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (token == null || token.isEmpty()) {
            writeError(response, "请先登录");
            return false;
        }

        TokenEntity tokenEntity = tokenService.validateToken(token);
        if (tokenEntity == null) {
            writeError(response, "登录已过期，请重新登录");
            return false;
        }

        UserContext.setUserId(tokenEntity.getUserId());
        UserContext.setUsername(tokenEntity.getUsername());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UserContext.clear();
    }

    private void writeError(HttpServletResponse response, String message) throws Exception {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        BaseResponse<Void> baseResponse = BaseResponse.tokenExpire(message);
        response.getWriter().write(jsonMapper.writeValueAsString(baseResponse));
    }
}
