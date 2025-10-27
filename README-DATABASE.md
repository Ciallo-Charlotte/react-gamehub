# 数据库存储用户信息配置指南

本指南介绍如何将用户账号密码从网页缓存（localStorage）迁移到MySQL数据库中存储。

## 前提条件

1. 已安装Node.js环境
2. 已安装MySQL数据库服务器
3. 确保MySQL服务器运行在localhost:3306
4. 数据库配置：
   - 用户名: root
   - 密码: password
   - 数据库名: gamehub

## 配置步骤

### 1. 启动后端服务

```bash
# 方法一：使用批处理脚本（推荐Windows用户）
./start-backend.bat

# 方法二：手动启动
cd src/backend
npm install express mysql2 bcryptjs cors dotenv
node server.js
```

### 2. 数据库自动初始化

后端服务启动时会自动：
- 创建必要的数据库表（users和favorites）
- 建立数据库连接池
- 启动API服务在http://localhost:5000

### 3. 前端自动连接

前端代码已配置为自动连接到后端服务，无需额外配置。

## 数据库结构

### users表
- id: 用户ID（自增主键）
- username: 用户名（唯一）
- password: 加密后的密码
- avatar: 用户头像URL
- bio: 用户简介
- created_at: 创建时间
- updated_at: 更新时间

### favorites表
- id: 收藏ID（自增主键）
- user_id: 用户ID（外键）
- item_id: 收藏项目ID
- item_type: 收藏项目类型
- created_at: 创建时间

## 密码安全

- 所有用户密码均使用bcrypt算法加密存储
- 加密强度为10轮salt
- 前端不会直接处理密码加密，所有加密操作在后端完成

## 注意事项

1. 确保MySQL服务正在运行且可访问
2. 数据库连接配置可在`src/backend/server.js`中修改
3. 后端默认端口为5000，如有冲突请修改配置
4. 本示例使用的是简单的认证机制，生产环境建议使用JWT等更安全的方式
5. 运行前请确保已安装所需的Node.js依赖包

## 常见问题

**Q: 启动后端时报错"无法连接到数据库"**
A: 请检查MySQL服务是否运行，以及连接配置是否正确。

**Q: 前端登录/注册失败**
A: 请确认后端服务是否正在运行，并检查浏览器控制台的错误信息。

**Q: 如何重置数据库**
A: 可以手动在MySQL中删除并重新创建数据库，或修改`server.js`中的表创建逻辑。