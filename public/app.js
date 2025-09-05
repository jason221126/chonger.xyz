// TechBlog Application JavaScript
class TechBlogApp {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'home';
        this.apiBaseUrl = '/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.updateActiveNav(link);
            });
        });

        // Auth buttons
        document.getElementById('login-btn')?.addEventListener('click', () => {
            this.showModal('login-modal');
        });

        document.getElementById('register-btn')?.addEventListener('click', () => {
            this.showModal('register-modal');
        });

        document.getElementById('logout-btn')?.addEventListener('click', () => {
            this.logout();
        });

        // Modal switches
        document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('login-modal');
            this.showModal('register-modal');
        });

        document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('register-modal');
            this.showModal('login-modal');
        });

        // Forms
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e.target);
        });

        document.getElementById('register-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e.target);
        });

        document.getElementById('create-blog-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateBlog(e.target);
        });

        document.getElementById('create-forum-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateForum(e.target);
        });

        // Create buttons
        document.getElementById('create-blog-btn')?.addEventListener('click', () => {
            this.showModal('create-blog-modal');
        });

        document.getElementById('create-forum-btn')?.addEventListener('click', () => {
            this.showModal('create-forum-modal');
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateActiveFilter(e.target, '.filter-btn');
                this.loadBlogPosts(e.target.dataset.filter);
            });
        });

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateActiveFilter(e.target, '.category-btn');
                this.loadForumPosts(e.target.dataset.category);
            });
        });

        // Hero action buttons
        document.querySelectorAll('.hero-actions .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.dataset.section;
                if (section) {
                    this.showSection(section);
                }
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;

            // Load section-specific data
            if (sectionName === 'blog') {
                this.loadBlogPosts();
            } else if (sectionName === 'forum') {
                this.loadForumPosts();
            } else if (sectionName === 'about') {
                this.loadAboutStats();
            }
        }
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updateActiveFilter(activeBtn, selector) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    async loadUserData() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    this.currentUser = await response.json();
                    this.updateAuthUI();
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                localStorage.removeItem('token');
            }
        }
    }

    updateAuthUI() {
        const navAuth = document.getElementById('nav-auth');
        const navUser = document.getElementById('nav-user');
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');

        if (this.currentUser) {
            navAuth.style.display = 'none';
            navUser.style.display = 'flex';
            userName.textContent = this.currentUser.username;
            userAvatar.src = this.currentUser.avatar || 'https://via.placeholder.com/32';

            // Show create buttons
            document.getElementById('create-blog-btn').style.display = 'inline-flex';
            document.getElementById('create-forum-btn').style.display = 'inline-flex';
        } else {
            navAuth.style.display = 'flex';
            navUser.style.display = 'none';

            // Hide create buttons
            document.getElementById('create-blog-btn').style.display = 'none';
            document.getElementById('create-forum-btn').style.display = 'none';
        }
    }

    async handleLogin(form) {
        const formData = new FormData(form);
        const data = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('token', result.access_token);
                this.currentUser = result.user;
                this.updateAuthUI();
                this.hideModal('login-modal');
                this.showNotification('登录成功！', 'success');
            } else {
                const error = await response.json();
                this.showNotification(error.message || '登录失败', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('网络错误，请重试', 'error');
        }
    }

    async handleRegister(form) {
        const formData = new FormData(form);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('token', result.access_token);
                this.currentUser = result.user;
                this.updateAuthUI();
                this.hideModal('register-modal');
                this.showNotification('注册成功！', 'success');
            } else {
                const error = await response.json();
                this.showNotification(error.message || '注册失败', 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            this.showNotification('网络错误，请重试', 'error');
        }
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser = null;
        this.updateAuthUI();
        this.showNotification('已退出登录', 'info');
    }

    async handleCreateBlog(form) {
        if (!this.currentUser) {
            this.showNotification('请先登录', 'error');
            return;
        }

        const formData = new FormData(form);
        const data = {
            title: formData.get('title'),
            content: formData.get('content'),
            excerpt: formData.get('excerpt'),
            tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : []
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/blog`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.hideModal('create-blog-modal');
                this.showNotification('文章发布成功！', 'success');
                form.reset();
                this.loadBlogPosts();
            } else {
                const error = await response.json();
                this.showNotification(error.message || '发布失败', 'error');
            }
        } catch (error) {
            console.error('Create blog error:', error);
            this.showNotification('网络错误，请重试', 'error');
        }
    }

    async handleCreateForum(form) {
        if (!this.currentUser) {
            this.showNotification('请先登录', 'error');
            return;
        }

        const formData = new FormData(form);
        const data = {
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : []
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/forum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.hideModal('create-forum-modal');
                this.showNotification('帖子发布成功！', 'success');
                form.reset();
                this.loadForumPosts();
            } else {
                const error = await response.json();
                this.showNotification(error.message || '发布失败', 'error');
            }
        } catch (error) {
            console.error('Create forum error:', error);
            this.showNotification('网络错误，请重试', 'error');
        }
    }

    async loadBlogPosts(filter = 'all') {
        const blogGrid = document.getElementById('blog-grid');
        blogGrid.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        try {
            const response = await fetch(`${this.apiBaseUrl}/blog?page=1&limit=12`);
            if (response.ok) {
                const data = await response.json();
                this.renderBlogPosts(data.posts);
            } else {
                this.showEmptyState(blogGrid, 'blog');
            }
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.showEmptyState(blogGrid, 'blog');
        }
    }

    renderBlogPosts(posts) {
        const blogGrid = document.getElementById('blog-grid');
        
        if (posts.length === 0) {
            this.showEmptyState(blogGrid, 'blog');
            return;
        }

        blogGrid.innerHTML = posts.map(post => `
            <div class="blog-card fade-in" onclick="app.viewBlogPost('${post.id}')">
                <div class="blog-card-image">
                    <i class="fas fa-blog"></i>
                </div>
                <div class="blog-card-content">
                    <h3 class="blog-card-title">${this.escapeHtml(post.title)}</h3>
                    <p class="blog-card-excerpt">${this.escapeHtml(post.excerpt || post.content.substring(0, 150) + '...')}</p>
                    <div class="blog-card-meta">
                        <div class="blog-card-author">
                            <img src="${post.author.avatar || 'https://via.placeholder.com/24'}" alt="${post.author.username}" width="24" height="24">
                            <span>${this.escapeHtml(post.author.username)}</span>
                        </div>
                        <div class="blog-card-stats">
                            <span><i class="fas fa-eye"></i> ${post.viewCount}</span>
                            <span><i class="fas fa-heart"></i> ${post.likeCount}</span>
                            <span><i class="fas fa-comment"></i> ${post.commentCount}</span>
                        </div>
                    </div>
                    ${post.tags && post.tags.length > 0 ? `
                        <div class="blog-card-tags">
                            ${post.tags.map(tag => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    async loadForumPosts(category = 'all') {
        const forumPosts = document.getElementById('forum-posts');
        forumPosts.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        try {
            const url = category === 'all' ? 
                `${this.apiBaseUrl}/forum?page=1&limit=20` : 
                `${this.apiBaseUrl}/forum?page=1&limit=20&category=${category}`;
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                this.renderForumPosts(data.posts);
            } else {
                this.showEmptyState(forumPosts, 'forum');
            }
        } catch (error) {
            console.error('Error loading forum posts:', error);
            this.showEmptyState(forumPosts, 'forum');
        }
    }

    renderForumPosts(posts) {
        const forumPosts = document.getElementById('forum-posts');
        
        if (posts.length === 0) {
            this.showEmptyState(forumPosts, 'forum');
            return;
        }

        forumPosts.innerHTML = posts.map(post => `
            <div class="forum-post fade-in" onclick="app.viewForumPost('${post.id}')">
                <div class="forum-post-header">
                    <h3 class="forum-post-title">${this.escapeHtml(post.title)}</h3>
                    <span class="forum-post-category">${this.getCategoryName(post.category)}</span>
                </div>
                <p class="forum-post-content">${this.escapeHtml(post.content.substring(0, 200) + '...')}</p>
                <div class="forum-post-meta">
                    <div class="forum-post-author">
                        <img src="${post.author.avatar || 'https://via.placeholder.com/24'}" alt="${post.author.username}" width="24" height="24">
                        <span>${this.escapeHtml(post.author.username)}</span>
                        <span>•</span>
                        <span>${this.formatDate(post.createdAt)}</span>
                    </div>
                    <div class="forum-post-stats">
                        <span><i class="fas fa-eye"></i> ${post.viewCount}</span>
                        <span><i class="fas fa-heart"></i> ${post.likeCount}</span>
                        <span><i class="fas fa-comment"></i> ${post.commentCount}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadAboutStats() {
        try {
            const [blogResponse, usersResponse] = await Promise.all([
                fetch(`${this.apiBaseUrl}/blog?page=1&limit=1`),
                fetch(`${this.apiBaseUrl}/users`)
            ]);

            if (blogResponse.ok && usersResponse.ok) {
                const blogData = await blogResponse.json();
                const usersData = await usersResponse.json();
                
                document.getElementById('total-posts').textContent = blogData.total || 0;
                document.getElementById('total-users').textContent = usersData.length || 0;
                document.getElementById('total-comments').textContent = '0'; // This would need a separate endpoint
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    showEmptyState(container, type) {
        const messages = {
            blog: {
                icon: 'fas fa-blog',
                title: '暂无文章',
                message: '还没有发布任何文章，快来写第一篇吧！'
            },
            forum: {
                icon: 'fas fa-comments',
                title: '暂无帖子',
                message: '还没有任何讨论，快来发起第一个话题吧！'
            }
        };

        const msg = messages[type];
        container.innerHTML = `
            <div class="empty-state">
                <i class="${msg.icon}"></i>
                <h3>${msg.title}</h3>
                <p>${msg.message}</p>
            </div>
        `;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: var(--spacing-4);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        // Add type-specific styling
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            warning: 'var(--warning-color)',
            info: 'var(--primary-color)'
        };
        
        notification.style.borderLeftColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    getCategoryName(category) {
        const categories = {
            general: '综合讨论',
            tech: '技术交流',
            lifestyle: '生活分享',
            help: '求助问答'
        };
        return categories[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) {
            return '今天';
        } else if (days === 1) {
            return '昨天';
        } else if (days < 7) {
            return `${days}天前`;
        } else {
            return date.toLocaleDateString('zh-CN');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    viewBlogPost(id) {
        // This would open a detailed view of the blog post
        console.log('View blog post:', id);
        this.showNotification('博客详情页面开发中...', 'info');
    }

    viewForumPost(id) {
        // This would open a detailed view of the forum post
        console.log('View forum post:', id);
        this.showNotification('论坛详情页面开发中...', 'info');
    }

    loadInitialData() {
        // Load initial data when the app starts
        if (this.currentSection === 'blog') {
            this.loadBlogPosts();
        } else if (this.currentSection === 'forum') {
            this.loadForumPosts();
        } else if (this.currentSection === 'about') {
            this.loadAboutStats();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TechBlogApp();
});

// Add some CSS for notifications
const notificationStyles = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        color: var(--text-primary);
    }
    
    .notification-content i {
        color: var(--primary-color);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
