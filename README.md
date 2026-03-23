# 后台管理系统

基于 React + Vite + Ant Design 构建的前端后台管理系统，包含用户管理、角色管理、权限控制、数据可视化等核心功能。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + Vite 8 |
| UI 组件库 | Ant Design 6 |
| 路由 | React Router DOM 7 |
| 状态管理 | Zustand 5 |
| HTTP 请求 | Axios |
| 数据可视化 | ECharts + echarts-for-react、Recharts |
| 数据模拟 | Mock.js |
| 代码规范 | ESLint + React Compiler |

## 项目预览
[https://admin-system-coral.vercel.app/dashboard](https://grant-ccc.github.io/admin-system/)

## 项目功能

### 认证与权限
- 账号密码登录，支持 token 持久化（localStorage）
- 基于角色的权限控制（RBAC），内置 `admin` / `user` 两种角色
- 路由守卫，未登录自动跳转登录页
- 动态菜单，根据当前用户权限过滤可见菜单项

### 用户管理
- 用户列表分页展示（服务端分页）
- 关键词搜索（姓名 / 邮箱）
- 新增 / 编辑 / 删除用户（按钮级权限控制）
- 用户详情页（含头像展示）

### 角色管理
- 角色列表查看
- 新增 / 编辑角色，支持权限树勾选
- 删除角色

### 数据看板（Dashboard）
- 顶部统计卡片：用户数、订单数、访问量、销售额
- 访问趋势折线图
- 本周 vs 上周订单对比柱状图
- 角色占比饼图
- 系统健康度雷达图
- 最新订单表格

### 其他
- 侧边栏折叠，状态持久化
- 用户退出登录


## 目录结构

```
src/
├── api.js                  # Axios 实例 & 拦截器
├── App.jsx                 # 路由配置
├── main.jsx                # 入口文件
├── index.css               # 全局样式
├── components/
│   ├── AuthRoute.jsx       # 路由守卫
│   └── UserAvatar.jsx      # 用户头像组件
├── config/
│   ├── menuConfig.js       # 菜单配置
│   └── permissionTree.js   # 权限树配置
├── layouts/
│   └── AdminLayout.jsx     # 后台主布局
├── mock/
│   ├── users.js            # 用户 & 角色接口 Mock
│   └── dashboard.js        # 看板数据 Mock
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   ├── UsersDetail.jsx
│   └── role/
│       ├── RoleList.jsx
│       └── RoleEdit.jsx
└── store/
    ├── useAuthStore.js       # 认证状态
    ├── usePermissionStore.js # 权限状态
    └── useUIStore.js         # UI 状态（菜单折叠等）
```


## 快速开始

**环境要求：** Node.js >= 20.19.0

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产包
npm run build

# 预览构建产物
npm run preview
```


## 测试账号

| 账号 | 密码 | 角色 | 权限说明 |
|------|------|------|----------|
| admin | 123456 | 管理员 | 所有功能 |
| user | 123456 | 普通用户 | 仅查看仪表盘和用户列表 |


## 数据说明

项目使用 Mock.js 在前端模拟所有接口，**无需后端服务**即可完整运行。Mock 数据在 `src/mock/` 目录下定义，包括：

- 用户列表（随机生成 50~80 条）
- 角色数据
- 看板各图表数据

## License

MIT
