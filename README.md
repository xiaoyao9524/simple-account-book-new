# 简单记账 (Simple Account Book)

一个基于 **Vite + Spring Boot** 全栈重构的移动端记账应用，前端采用 React 19 + TypeScript，后端采用 Spring Boot 4 + Java 21，提供完整的记账、分类管理与用户认证功能。

## 项目亮点 — Vite + Spring Boot 重构

本项目从旧版架构迁移至现代化技术栈，核心重构点如下：

### 前端 — Vite 重构

| 旧方案 | 重构后 |
|--------|--------|
| 传统打包工具 | **Vite 8** 极速冷启动 + HMR 热更新 |
| JS / 旧框架 | **React 19 + TypeScript 6** 类型安全开发 |
| 手动状态管理 | **Zustand** 轻量状态管理 |
| 手写样式 | **SCSS 模块化** + iconfont 图标体系 |
| 无编译优化 | **React Compiler** 自动优化渲染性能 |

- 利用 Vite 的原生 ESM 开发服务器，启动速度从秒级降至毫秒级
- 通过 `@vitejs/plugin-react` + `@rolldown/plugin-babel` 启用 React Compiler，减少手动 memo 优化
- Vite 开发代理配置 (`/api` → `localhost:8080`)，前后端无缝联调
- `@dnd-kit` 拖拽排序，移动端交互体验流畅

### 后端 — Spring Boot 重构

| 旧方案 | 重构后 |
|--------|--------|
| 手写 Servlet / 旧框架 | **Spring Boot 4.1.1** 约定优于配置 |
| 手动 JDBC | **MyBatis Spring Boot Starter** 数据访问层 |
| Session 认证 | **JWT (jjwt)** 无状态 Token 认证 |
| 手动参数校验 | **Spring Validation** 声明式校验 |
| 无全局异常处理 | **全局异常处理器 + 统一响应封装** |
| 手动 SQL 字段填充 | **MyBatis 自动填充拦截器** |

- Java 21 虚拟线程支持，高并发场景下性能更优
- 标准分层架构：Controller → Service → Mapper，职责清晰
- JWT 拦截器统一鉴权，UserContext 线程隔离用户信息
- AOP 切面 + Validation 参数校验，减少重复代码
- Jackson 统一日期格式化与时区处理

## 技术栈总览

### 前端 (`bill-client`)

- **构建工具**: Vite 8
- **框架**: React 19 + TypeScript 6
- **UI 组件**: Ant Design Mobile 5
- **路由**: React Router DOM 7
- **状态管理**: Zustand 5
- **HTTP 请求**: Axios
- **拖拽交互**: @dnd-kit/core + @dnd-kit/sortable
- **表单管理**: React Hook Form 7
- **样式方案**: SCSS + iconfont 图标
- **编译优化**: React Compiler (Babel 插件)
- **代码规范**: ESLint + TypeScript ESLint

### 后端 (`bill-server`)

- **框架**: Spring Boot 4.1.1
- **语言**: Java 21
- **ORM**: MyBatis Spring Boot Starter 4.1
- **数据库**: MySQL
- **认证**: JWT (jjwt 0.12.6)
- **工具库**: Lombok
- **AOP**: spring-boot-starter-aop
- **参数校验**: spring-boot-starter-validation
- **构建工具**: Maven

## 功能模块

- **用户认证** — 注册 / 登录，JWT Token 鉴权
- **记账** — 收支记账，计算器组件辅助输入
- **分类管理** — 自定义收支分类，拖拽排序
- **首页** — 账单列表展示
- **个人中心** — 用户信息管理
- **响应式适配** — 移动端优先，自动识别设备类型

## 项目结构

```
simple-account-book-new/
├── bill-client/                  # 前端 (Vite + React)
│   ├── src/
│   │   ├── api/                  # API 请求层
│   │   ├── components/            # 通用组件 (计算器/导航栏/底部TabBar)
│   │   ├── pages/                # 页面组件 (首页/记账/登录/注册/分类设置...)
│   │   ├── store/                # Zustand 状态管理
│   │   ├── types/                # TypeScript 类型定义
│   │   ├── utils/                # 工具函数
│   │   ├── styles/               # 全局样式 + iconfont 字体图标
│   │   └── hooks/                # 自定义 Hooks
│   ├── vite.config.ts            # Vite 配置 (代理/别名/插件)
│   └── package.json
│
├── bill-server/                  # 后端 (Spring Boot)
│   ├── src/main/java/com/xy/simple_accountbook/bill/
│   │   ├── controller/           # 控制层
│   │   ├── service/               # 业务层 (接口 + 实现)
│   │   ├── mapper/                # 数据访问层
│   │   ├── entity/                # 实体类 + VO
│   │   ├── dto/                   # 请求/响应 DTO
│   │   ├── config/                # 配置 (拦截器/异常处理/Jackson)
│   │   └── common/                # 公共组件 (上下文/枚举/工具)
│   ├── src/main/resources/
│   │   ├── application.properties # 应用配置
│   │   └── mapper/                # MyBatis XML 映射
│   └── pom.xml
│
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18
- Java 21
- MySQL 8+
- Maven 3.9+

### 后端启动

```bash
cd bill-server

# 配置数据库连接 (src/main/resources/application.properties)
# spring.datasource.url = jdbc:mysql://127.0.0.1:3306/bill
# spring.datasource.username = root
# spring.datasource.password = your_password

# 启动 Spring Boot 服务 (默认端口 8080)
mvnw spring-boot:run
```

### 前端启动

```bash
cd bill-client

# 安装依赖
npm install

# 启动 Vite 开发服务器 (默认端口 5173)
npm run dev

# 构建生产包
npm run build

# 预览生产构建
npm run preview
```

浏览器访问 `http://localhost:5173` 即可使用，Vite 开发服务器已配置 `/api` 代理转发至后端 `http://localhost:8080`。

## 重构收益

- **开发体验** — Vite 毫秒级 HMR 热更新，改完代码即时可见
- **类型安全** — 前后端均采用强类型 (TypeScript + Java)，减少运行时错误
- **性能优化** — React Compiler 自动优化 + Java 21 虚拟线程，前后端双重提速
- **架构清晰** — 前端组件化 + 后端标准分层，可维护性大幅提升
- **认证升级** — 从 Session 迁移至 JWT 无状态认证，支持横向扩展
- **开发效率** — Lombok 消除样板代码，Validation 声明式校验，AOP 统一切面
