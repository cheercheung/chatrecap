# 用户注册系统

这个文件夹包含了一个完整的用户注册系统，基于 Next.js 和 Supabase 实现。

## 系统架构

```
用户注册系统
├── 认证层 (Authentication Layer)
│   ├── Supabase Auth
│   │   ├── 配置文件 (lib/supabase/config.ts)
│   │   ├── 客户端初始化 (lib/supabase/client.ts)
│   │   └── 服务端初始化 (lib/supabase/server.ts)
│   └── 认证提供商 (Auth Providers)
│       ├── Google OAuth
│       ├── GitHub OAuth
│       └── 邮箱密码登录
├── 数据层 (Data Layer)
│   ├── 用户模型 (User Model)
│   │   └── 用户数据操作 (models/user.ts)
│   └── 数据库连接 (Database Connection)
│       └── Supabase 数据库
├── 服务层 (Service Layer)
│   ├── 用户服务 (services/user.ts)
│   │   ├── saveUser 函数
│   │   ├── getUserInfo 函数
│   │   ├── getUserUuid 函数
│   │   └── getUserEmail 函数
│   └── 邀请服务
│       └── 邀请关系更新
└── 前端交互层 (UI Layer)
    ├── 登录组件
    │   ├── 登录表单 (components/sign/form.tsx)
    │   ├── 登录模态框 (components/sign/modal.tsx)
    │   └── 登录按钮 (components/sign/sign_in.tsx)
    ├── 用户信息组件
    │   ├── 用户头像 (components/sign/user.tsx)
    │   └── 用户菜单 (components/dashboard/sidebar/user.tsx)
    └── 应用上下文
        └── 用户状态管理 (contexts/app.tsx)
```

## 用户注册流程

1. **用户触发登录**
   - 用户点击登录按钮 (components/sign/sign_in.tsx)
   - 显示登录模态框 (components/sign/modal.tsx)
   - 用户选择登录方式 (Google, GitHub, 邮箱密码)

2. **认证处理**
   - Supabase Auth 处理认证请求
   - 根据配置调用相应的认证提供商
   - 认证提供商验证用户身份并返回用户信息

3. **用户数据保存**
   - 在 Supabase Auth 回调中处理用户数据
   - 构建用户数据对象并保存到 Supabase 数据库
   - 将用户信息存储到会话中

4. **用户信息获取**
   - 前端通过 Supabase 客户端获取会话信息
   - 应用上下文 (contexts/app.tsx) 中的 fetchUserInfo 函数获取完整用户信息
   - 将用户信息存储在应用上下文中

5. **用户信息展示**
   - 根据用户登录状态显示不同的UI组件
   - 已登录用户显示用户头像和菜单
   - 未登录用户显示登录按钮

## 文件说明

### 认证配置
- `lib/supabase/config.ts`: Supabase 配置文件
- `lib/supabase/client.ts`: Supabase 客户端初始化
- `lib/supabase/server.ts`: Supabase 服务端初始化
- `app/auth/callback/route.ts`: Supabase Auth 回调处理

### 用户类型定义
- `types/user.ts`: 用户类型定义
- `types/supabase.ts`: Supabase 类型定义

### 用户服务和模型
- `services/user.ts`: 用户服务函数
- `models/user.ts`: 用户数据模型操作

### 前端组件
- `components/sign/form.tsx`: 登录表单组件
- `components/sign/modal.tsx`: 登录模态框组件
- `components/sign/sign_in.tsx`: 登录按钮组件
- `components/sign/user.tsx`: 用户头像和菜单组件
- `components/sign/toggle.tsx`: 登录状态切换组件
- `components/dashboard/sidebar/user.tsx`: 侧边栏用户组件

### 应用上下文
- `contexts/app.tsx`: 应用上下文，管理用户状态
- `types/context.d.ts`: 上下文类型定义

### API路由
- `app/api/get-user-info/route.ts`: 获取用户信息API
- `app/api/update-invite/route.ts`: 更新邀请关系API

### 页面示例
- `app/[locale]/auth/signin/page.tsx`: 登录页面
- `app/[locale]/(default)/(console)/layout.tsx`: 需要登录的布局页面

## 使用方法

1. 配置环境变量
   - 设置 Supabase URL 和 API 密钥
   - 配置 Google 和 GitHub OAuth 凭证（在 Supabase 控制台中）

2. 集成到项目中
   - 复制相关文件到对应目录
   - 在 layout.tsx 中引入 Supabase Provider
   - 在需要的地方使用登录组件

3. 数据库配置
   - 在 Supabase 控制台中创建必要的表和关系
   - 设置适当的行级安全策略（RLS）
