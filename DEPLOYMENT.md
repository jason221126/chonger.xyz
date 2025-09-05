# TechBlog 部署指南

本文档将指导您如何部署 TechBlog 应用到生产环境。

## 🚀 部署方式

### 方式一：传统服务器部署

#### 1. 服务器要求
- Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+
- Node.js 16+
- MySQL 8.0+
- Nginx (可选，用于反向代理)
- PM2 (进程管理)

#### 2. 安装依赖
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm mysql-server nginx

# CentOS/RHEL
sudo yum install nodejs npm mysql-server nginx

# 安装 PM2
sudo npm install -g pm2
```

#### 3. 配置数据库
```bash
# 启动 MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 创建数据库
mysql -u root -p < database.sql
```

#### 4. 部署应用
```bash
# 克隆项目
git clone <your-repo-url>
cd personal-blog-forum

# 安装依赖
npm install

# 构建项目
npm run build

# 配置环境变量
cp config.env .env
# 编辑 .env 文件，配置生产环境参数

# 使用 PM2 启动
pm2 start dist/main.js --name "techblog"
pm2 startup
pm2 save
```

#### 5. 配置 Nginx (可选)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /static {
        alias /path/to/your/app/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 方式二：Docker 部署

#### 1. 创建 Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

#### 2. 创建 docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=techblog
      - DB_PASSWORD=your_password
      - DB_DATABASE=personal_blog_forum
      - JWT_SECRET=your-super-secret-jwt-key
    depends_on:
      - mysql
    volumes:
      - ./uploads:/app/uploads

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=personal_blog_forum
      - MYSQL_USER=techblog
      - MYSQL_PASSWORD=your_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  mysql_data:
```

#### 3. 部署命令
```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方式三：云平台部署

#### Heroku 部署
```bash
# 安装 Heroku CLI
npm install -g heroku

# 登录 Heroku
heroku login

# 创建应用
heroku create your-app-name

# 添加 MySQL 插件
heroku addons:create cleardb:ignite

# 设置环境变量
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key

# 部署
git push heroku main
```

#### Vercel 部署
```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

## 🔧 环境配置

### 生产环境变量
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_secure_password
DB_DATABASE=personal_blog_forum

# JWT 配置
JWT_SECRET=your-very-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=3000
NODE_ENV=production

# 文件上传配置
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 安全配置
1. **更改默认密码**：确保所有默认密码都已更改
2. **JWT 密钥**：使用强随机字符串作为 JWT 密钥
3. **数据库权限**：限制数据库用户权限
4. **HTTPS**：配置 SSL 证书
5. **防火墙**：配置适当的防火墙规则

## 📊 监控与维护

### 日志管理
```bash
# 查看 PM2 日志
pm2 logs techblog

# 查看错误日志
pm2 logs techblog --err

# 重启应用
pm2 restart techblog
```

### 性能监控
```bash
# 安装监控工具
npm install -g clinic

# 性能分析
clinic doctor -- node dist/main.js
```

### 数据库备份
```bash
# 创建备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u username -p personal_blog_forum > backup_$DATE.sql

# 设置定时任务
crontab -e
# 添加：0 2 * * * /path/to/backup.sh
```

## 🔄 更新部署

### 应用更新
```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm install

# 构建应用
npm run build

# 重启服务
pm2 restart techblog
```

### 数据库迁移
```bash
# 备份当前数据库
mysqldump -u username -p personal_blog_forum > backup_before_migration.sql

# 运行迁移脚本
mysql -u username -p personal_blog_forum < migration.sql
```

## 🚨 故障排除

### 常见问题

1. **应用无法启动**
   - 检查端口是否被占用
   - 验证环境变量配置
   - 查看错误日志

2. **数据库连接失败**
   - 检查数据库服务状态
   - 验证连接参数
   - 检查防火墙设置

3. **静态文件无法访问**
   - 检查文件路径
   - 验证 Nginx 配置
   - 检查文件权限

### 日志位置
- 应用日志：`pm2 logs techblog`
- Nginx 日志：`/var/log/nginx/`
- MySQL 日志：`/var/log/mysql/`

## 📈 性能优化

### 应用优化
- 启用 gzip 压缩
- 配置缓存策略
- 使用 CDN
- 数据库查询优化

### 服务器优化
- 调整 Node.js 内存限制
- 配置负载均衡
- 使用 Redis 缓存
- 数据库索引优化

## 🔐 安全建议

1. **定期更新依赖**
2. **使用 HTTPS**
3. **配置 CORS**
4. **实施速率限制**
5. **定期安全扫描**
6. **备份重要数据**

---

遵循本指南，您就可以成功部署 TechBlog 应用到生产环境了！
