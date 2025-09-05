# TechBlog - 个人博客与论坛

一个基于 NestJS 构建的现代化个人博客与论坛平台，采用极简科技风格设计。

## ✨ 功能特色

### 🎨 设计风格
- **极简科技风**：深色主题，现代化界面设计
- **响应式布局**：完美适配桌面端和移动端
- **流畅动画**：精心设计的交互动效
- **代码高亮**：支持多种编程语言语法高亮

### 📝 博客功能
- 文章发布与管理
- 标签分类系统
- 文章搜索与筛选
- 阅读统计
- 点赞与评论系统

### 💬 论坛功能
- 多分类讨论区
- 帖子发布与回复
- 嵌套评论系统
- 用户互动（点赞、收藏）
- 热门话题推荐

### 👤 用户系统
- 用户注册与登录
- JWT 身份认证
- 个人资料管理
- 头像上传
- 权限控制

## 🚀 技术栈

### 后端
- **NestJS** - 现代化的 Node.js 框架
- **TypeORM** - 强大的 ORM 框架
- **MySQL** - 关系型数据库
- **JWT** - 身份认证
- **Passport** - 认证中间件
- **bcryptjs** - 密码加密

### 前端
- **原生 JavaScript** - 无框架依赖
- **CSS3** - 现代化样式
- **Font Awesome** - 图标库
- **Google Fonts** - 字体库

## 📦 安装与运行

### 环境要求
- Node.js 16+ 
- MySQL 8.0+
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd personal-blog-forum
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置数据库
创建 MySQL 数据库：
```sql
CREATE DATABASE personal_blog_forum;
```

### 4. 配置环境变量
复制 `config.env` 文件并修改配置：
```bash
cp config.env .env
```

修改 `.env` 文件中的数据库配置：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=personal_blog_forum

JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### 5. 运行项目
```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

### 6. 访问应用
打开浏览器访问：`http://localhost:3000`

## 📁 项目结构

```
personal-blog-forum/
├── src/
│   ├── auth/                 # 认证模块
│   │   ├── dto/             # 数据传输对象
│   │   ├── guards/          # 认证守卫
│   │   └── strategies/      # 认证策略
│   ├── blog/                # 博客模块
│   │   └── dto/             # 博客相关 DTO
│   ├── forum/               # 论坛模块
│   │   └── dto/             # 论坛相关 DTO
│   ├── users/               # 用户模块
│   │   └── dto/             # 用户相关 DTO
│   ├── database/            # 数据库模块
│   │   └── entities/        # 数据库实体
│   ├── common/              # 公共模块
│   ├── app.module.ts        # 应用根模块
│   └── main.ts              # 应用入口
├── public/                  # 静态文件
│   ├── index.html           # 主页面
│   ├── styles.css           # 样式文件
│   └── app.js               # 前端逻辑
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript 配置
└── README.md                # 项目说明
```

## 🎯 API 接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/profile` - 获取用户信息

### 博客接口
- `GET /api/blog` - 获取博客列表
- `POST /api/blog` - 创建博客文章
- `GET /api/blog/:id` - 获取博客详情
- `PUT /api/blog/:id` - 更新博客文章
- `DELETE /api/blog/:id` - 删除博客文章
- `POST /api/blog/:id/comments` - 添加评论
- `POST /api/blog/:id/like` - 点赞/取消点赞

### 论坛接口
- `GET /api/forum` - 获取论坛帖子列表
- `POST /api/forum` - 创建论坛帖子
- `GET /api/forum/:id` - 获取帖子详情
- `PUT /api/forum/:id` - 更新帖子
- `DELETE /api/forum/:id` - 删除帖子
- `POST /api/forum/:id/comments` - 添加评论
- `POST /api/forum/:id/like` - 点赞/取消点赞
- `GET /api/forum/categories` - 获取分类列表

### 用户接口
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

## 🎨 设计特色

### 色彩方案
- **主色调**：科技蓝 (#00d4ff)
- **辅助色**：紫色 (#6366f1)
- **背景色**：深色系 (#0a0a0a, #111111)
- **文字色**：白色系 (#ffffff, #a1a1aa)

### 交互效果
- 悬停动画
- 渐变背景
- 阴影效果
- 代码动画
- 响应式设计

## 🔧 开发指南

### 添加新功能
1. 在相应的模块中创建服务、控制器和 DTO
2. 更新数据库实体（如需要）
3. 添加路由和中间件
4. 更新前端界面和逻辑

### 数据库迁移
项目使用 TypeORM 的自动同步功能，在开发环境中会自动创建和更新数据库表结构。

### 部署建议
1. 使用 PM2 管理 Node.js 进程
2. 配置 Nginx 反向代理
3. 使用 SSL 证书
4. 配置数据库备份

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱：your-email@example.com
- GitHub：your-github-username

---

**TechBlog** - 让技术分享更简单，让开发者交流更便捷！
