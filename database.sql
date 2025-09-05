-- TechBlog Database Initialization Script
-- 创建数据库
CREATE DATABASE IF NOT EXISTS personal_blog_forum CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE personal_blog_forum;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    bio TEXT,
    role VARCHAR(20) DEFAULT 'user',
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建博客文章表
CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    coverImage VARCHAR(255),
    tags TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    viewCount INT DEFAULT 0,
    likeCount INT DEFAULT 0,
    commentCount INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    publishedAt TIMESTAMP NULL,
    authorId VARCHAR(36) NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建论坛帖子表
CREATE TABLE IF NOT EXISTS forum_posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    tags TEXT,
    category VARCHAR(50) DEFAULT 'general',
    viewCount INT DEFAULT 0,
    likeCount INT DEFAULT 0,
    commentCount INT DEFAULT 0,
    isPinned BOOLEAN DEFAULT FALSE,
    isLocked BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    authorId VARCHAR(36) NOT NULL,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(36) PRIMARY KEY,
    content TEXT NOT NULL,
    likeCount INT DEFAULT 0,
    isDeleted BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    authorId VARCHAR(36) NOT NULL,
    blogPostId VARCHAR(36) NULL,
    forumPostId VARCHAR(36) NULL,
    parentCommentId VARCHAR(36) NULL,
    FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blogPostId) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (forumPostId) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parentCommentId) REFERENCES comments(id) ON DELETE CASCADE
);

-- 创建点赞表
CREATE TABLE IF NOT EXISTS likes (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    blogPostId VARCHAR(36) NULL,
    forumPostId VARCHAR(36) NULL,
    commentId VARCHAR(36) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blogPostId) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (forumPostId) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (commentId) REFERENCES comments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_blog (userId, blogPostId),
    UNIQUE KEY unique_user_forum (userId, forumPostId),
    UNIQUE KEY unique_user_comment (userId, commentId)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_blog_posts_author ON blog_posts(authorId);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_created ON blog_posts(createdAt);
CREATE INDEX idx_forum_posts_author ON forum_posts(authorId);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_posts_created ON forum_posts(createdAt);
CREATE INDEX idx_comments_author ON comments(authorId);
CREATE INDEX idx_comments_blog_post ON comments(blogPostId);
CREATE INDEX idx_comments_forum_post ON comments(forumPostId);
CREATE INDEX idx_likes_user ON likes(userId);

-- 插入示例数据
INSERT INTO users (id, username, email, password, bio, role) VALUES 
('admin-001', 'admin', 'admin@techblog.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2O', 'TechBlog 管理员', 'admin'),
('user-001', 'techwriter', 'writer@techblog.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2O', '热爱技术的写作者', 'user'),
('user-002', 'developer', 'dev@techblog.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2O', '全栈开发者', 'user');

-- 插入示例博客文章
INSERT INTO blog_posts (id, title, content, excerpt, tags, status, authorId, publishedAt) VALUES 
('blog-001', 'NestJS 入门指南', 
'# NestJS 入门指南\n\nNestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它使用渐进式 JavaScript，内置并完全支持 TypeScript。\n\n## 主要特性\n\n- 开箱即用的 TypeScript 支持\n- 模块化架构\n- 依赖注入\n- 装饰器支持\n- 内置验证和管道\n\n## 快速开始\n\n```bash\nnpm i -g @nestjs/cli\nnest new project-name\ncd project-name\nnpm run start:dev\n```\n\n这就是 NestJS 的基本介绍，希望对你有所帮助！',
'学习如何使用 NestJS 构建现代化的 Node.js 应用程序',
'["NestJS", "Node.js", "TypeScript", "后端开发"]',
'published', 'user-001', NOW()),

('blog-002', '前端性能优化技巧', 
'# 前端性能优化技巧\n\n在当今的 Web 开发中，性能优化是至关重要的。本文将介绍一些实用的前端性能优化技巧。\n\n## 图片优化\n\n- 使用 WebP 格式\n- 实现懒加载\n- 压缩图片大小\n\n## 代码分割\n\n- 使用动态导入\n- 路由级别的代码分割\n- 组件级别的懒加载\n\n## 缓存策略\n\n- 浏览器缓存\n- CDN 缓存\n- 服务端缓存\n\n通过实施这些优化技巧，可以显著提升网站的性能和用户体验。',
'分享一些实用的前端性能优化技巧，提升网站加载速度',
'["前端", "性能优化", "JavaScript", "Web开发"]',
'published', 'user-002', NOW());

-- 插入示例论坛帖子
INSERT INTO forum_posts (id, title, content, tags, category, authorId) VALUES 
('forum-001', '如何学习 React Hooks？', 
'大家好，我是前端开发新手，想学习 React Hooks。请问有什么好的学习资源推荐吗？\n\n目前我已经掌握了基本的 React 组件和状态管理，想深入学习 Hooks 的使用。\n\n希望有经验的朋友能分享一下学习心得和最佳实践。',
'["React", "Hooks", "前端学习", "JavaScript"]',
'help', 'user-001'),

('forum-002', '分享一个有趣的 CSS 动画效果', 
'今天发现了一个很酷的 CSS 动画效果，分享给大家：\n\n```css\n@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n  100% { transform: scale(1); }\n}\n\n.element {\n  animation: pulse 2s infinite;\n}\n```\n\n这个效果可以让元素产生呼吸般的动画效果，非常适合用在按钮或者卡片上。\n\n大家还有什么其他有趣的 CSS 动画可以分享吗？',
'["CSS", "动画", "前端技巧", "分享"]',
'tech', 'user-002');

-- 插入示例评论
INSERT INTO comments (id, content, authorId, blogPostId) VALUES 
('comment-001', '很棒的教程！NestJS 确实是一个很强大的框架，感谢分享。', 'user-002', 'blog-001'),
('comment-002', '性能优化真的很重要，这些技巧很实用。', 'user-001', 'blog-002');

INSERT INTO comments (id, content, authorId, forumPostId) VALUES 
('comment-003', '推荐 React 官方文档的 Hooks 部分，写得非常详细。', 'user-002', 'forum-001'),
('comment-004', '这个动画效果确实很酷！我试试看。', 'user-001', 'forum-002');

-- 插入示例点赞
INSERT INTO likes (id, userId, blogPostId) VALUES 
('like-001', 'user-002', 'blog-001'),
('like-002', 'user-001', 'blog-002');

INSERT INTO likes (id, userId, forumPostId) VALUES 
('like-003', 'user-002', 'forum-001'),
('like-004', 'user-001', 'forum-002');

-- 显示创建结果
SELECT 'Database initialization completed successfully!' as message;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as blog_count FROM blog_posts;
SELECT COUNT(*) as forum_count FROM forum_posts;
SELECT COUNT(*) as comment_count FROM comments;
SELECT COUNT(*) as like_count FROM likes;
