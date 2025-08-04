/**
 * 成就系统 - 赛博朋克答题竞赛
 * 
 * 功能特性：
 * - 成就展示和分类筛选
 * - 实时成就进度追踪
 * - 成就解锁通知
 * - 成就统计概览
 * - 与答题系统集成
 * - 赛博朋克风格UI
 */

class AchievementSystem {
    constructor() {
        this.socket = null;
        this.achievements = [];
        this.userAchievements = [];
        this.currentUserId = null;
        this.currentFilter = 'all';
        this.notificationQueue = [];
        this.isProcessingNotifications = false;
        
        this.init();
    }

    async init() {
        try {
            // 初始化Socket.IO连接
            this.socket = io();
            
            // 获取当前用户ID
            await this.getCurrentUser();
            
            // 加载成就数据
            await this.loadAchievements();
            
            // 加载用户成就
            await this.loadUserAchievements();
            
            // 初始化UI组件
            this.initializeUI();
            
            // 设置事件监听器
            this.setupEventListeners();
            
            // 设置Socket.IO事件监听
            this.setupSocketListeners();
            
            // 开始处理成就通知
            this.processNotificationQueue();
            
            console.log('🏆 成就系统初始化完成');
        } catch (error) {
            console.error('❌ 成就系统初始化失败:', error);
        }
    }

    async getCurrentUser() {
        try {
            // 尝试从localStorage获取用户信息
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                this.currentUserId = user.id;
                return;
            }
            
            // 如果没有保存的用户信息，生成临时用户ID
            const tempUserId = localStorage.getItem('tempUserId') || this.generateTempUserId();
            localStorage.setItem('tempUserId', tempUserId);
            this.currentUserId = tempUserId;
        } catch (error) {
            console.error('获取用户信息失败:', error);
            this.currentUserId = this.generateTempUserId();
        }
    }

    generateTempUserId() {
        return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async loadAchievements() {
        try {
            const response = await fetch('/api/achievements');
            if (!response.ok) throw new Error('Failed to load achievements');
            
            this.achievements = await response.json();
            console.log(`📋 加载了 ${this.achievements.length} 个成就`);
        } catch (error) {
            console.error('加载成就失败:', error);
            this.achievements = this.getDefaultAchievements();
        }
    }

    async loadUserAchievements() {
        if (!this.currentUserId) return;
        
        try {
            const response = await fetch(`/api/user-achievements/${this.currentUserId}`);
            if (!response.ok) throw new Error('Failed to load user achievements');
            
            this.userAchievements = await response.json();
            console.log(`🏅 加载了 ${this.userAchievements.length} 个用户成就`);
        } catch (error) {
            console.error('加载用户成就失败:', error);
            this.userAchievements = [];
        }
    }

    getDefaultAchievements() {
        return [
            {
                id: 'first_answer',
                name: '初次答题',
                description: '完成你的第一次答题',
                category: 'answer',
                rarity: 'bronze',
                condition: { type: 'answer_count', target: 1 },
                rewards: { points: 10, title: '新手答题者' },
                icon: '🎯',
                isActive: true
            },
            {
                id: 'answer_master',
                name: '答题大师',
                description: '累计答对50道题目',
                category: 'answer',
                rarity: 'gold',
                condition: { type: 'answer_count', target: 50 },
                rewards: { points: 100, title: '答题大师' },
                icon: '🏆',
                isActive: true
            },
            {
                id: 'speed_demon',
                name: '极速答题',
                description: '在5秒内答对一道题目',
                category: 'speed',
                rarity: 'silver',
                condition: { type: 'answer_speed', target: 5 },
                rewards: { points: 25, title: '极速者' },
                icon: '⚡',
                isActive: true
            },
            {
                id: 'perfectionist',
                name: '完美主义者',
                description: '单次答题准确率达到100%',
                category: 'accuracy',
                rarity: 'gold',
                condition: { type: 'session_accuracy', target: 100 },
                rewards: { points: 50, title: '完美主义者' },
                icon: '💎',
                isActive: true
            },
            {
                id: 'night_owl',
                name: '夜猫子',
                description: '在深夜23:00-02:00期间答对10道题目',
                category: 'time',
                rarity: 'silver',
                condition: { type: 'time_based', target: 10, timeRange: '23:00-02:00' },
                rewards: { points: 30, title: '夜猫子' },
                icon: '🌙',
                isActive: true
            },
            {
                id: 'streak_master',
                name: '连胜大师',
                description: '连续答对5道题目',
                category: 'streak',
                rarity: 'silver',
                condition: { type: 'correct_streak', target: 5 },
                rewards: { points: 40, title: '连胜大师' },
                icon: '🔥',
                isActive: true
            }
        ];
    }

    initializeUI() {
        this.updateStats();
        this.renderAchievements();
        this.initializeCategories();
    }

    setupEventListeners() {
        // 分类按钮点击事件
        document.querySelectorAll('.achievement-category').forEach(button => {
            button.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
            });
        });
    }

    setupSocketListeners() {
        this.socket.on('achievement-unlocked', (data) => {
            if (data.userId === this.currentUserId) {
                this.showAchievementNotification(data.achievement);
                this.addToNotificationQueue(data);
            }
        });
    }

    updateStats() {
        const totalAchievements = this.achievements.length;
        const unlockedAchievements = this.userAchievements.length;
        const unlockRate = totalAchievements > 0 ? Math.round((unlockedAchievements / totalAchievements) * 100) : 0;
        const totalPoints = this.userAchievements.reduce((sum, ua) => {
            const achievement = this.achievements.find(a => a.id === ua.achievementId);
            return sum + (achievement?.rewards?.points || 0);
        }, 0);

        this.animateNumber('total-achievements', totalAchievements);
        this.animateNumber('unlocked-achievements', unlockedAchievements);
        this.animateNumber('unlock-rate', unlockRate, '%');
        this.animateNumber('total-points', totalPoints);
    }

    animateNumber(elementId, targetValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    renderAchievements() {
        const grid = document.getElementById('achievement-grid');
        if (!grid) return;

        const filteredAchievements = this.getFilteredAchievements();
        
        grid.innerHTML = filteredAchievements.map(achievement => {
            const userAchievement = this.userAchievements.find(ua => ua.achievementId === achievement.id);
            const isUnlocked = !!userAchievement;
            
            return this.createAchievementCard(achievement, userAchievement, isUnlocked);
        }).join('');

        // 添加动画效果
        this.addAchievementAnimations();
    }

    getFilteredAchievements() {
        if (this.currentFilter === 'all') {
            return this.achievements;
        }
        return this.achievements.filter(achievement => achievement.category === this.currentFilter);
    }

    createAchievementCard(achievement, userAchievement, isUnlocked) {
        const progress = this.calculateAchievementProgress(achievement);
        const rarity = achievement.rarity || 'bronze';
        
        return `
            <div class="achievement-card ${rarity} ${isUnlocked ? 'unlocked' : ''}" 
                 data-achievement-id="${achievement.id}"
                 onclick="achievementSystem.showAchievementDetails('${achievement.id}')">
                
                <div class="achievement-header">
                    <div class="achievement-badge ${rarity} ${isUnlocked ? 'unlocked' : ''}">
                        ${achievement.icon || '🏆'}
                    </div>
                    <div class="achievement-info">
                        <div class="achievement-title">${achievement.name}</div>
                        <div class="achievement-type">${this.getCategoryName(achievement.category)}</div>
                    </div>
                </div>
                
                <div class="achievement-description">${achievement.description}</div>
                
                ${progress < 100 ? `
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar">
                            <div class="achievement-progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="achievement-progress-text">
                            <span>进度</span>
                            <span>${progress}%</span>
                        </div>
                    </div>
                ` : ''}
                
                ${isUnlocked ? `
                    <div class="achievement-unlock-time">
                        解锁于 ${this.formatDate(userAchievement.unlockedAt)}
                    </div>
                ` : ''}
                
                ${achievement.rewards ? `
                    <div class="achievement-rewards">
                        ${achievement.rewards.points ? `<span class="reward-item points">+${achievement.rewards.points} 积分</span>` : ''}
                        ${achievement.rewards.title ? `<span class="reward-item">${achievement.rewards.title}</span>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    calculateAchievementProgress(achievement) {
        if (!achievement.condition) return 0;
        
        const userAchievement = this.userAchievements.find(ua => ua.achievementId === achievement.id);
        if (userAchievement) return 100;
        
        // 这里可以根据不同的条件类型计算进度
        // 目前简化处理，实际应用中需要根据用户数据计算
        return 0;
    }

    getCategoryName(category) {
        const categoryNames = {
            'answer': '答题成就',
            'streak': '连续成就',
            'speed': '速度成就',
            'accuracy': '准确率成就',
            'time': '时间成就'
        };
        return categoryNames[category] || '其他成就';
    }

    addAchievementAnimations() {
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    initializeCategories() {
        // 分类按钮已在HTML中定义，这里可以添加额外的初始化逻辑
    }

    filterByCategory(category) {
        this.currentFilter = category;
        
        // 更新按钮状态
        document.querySelectorAll('.achievement-category').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // 重新渲染成就
        this.renderAchievements();
    }

    showAchievementDetails(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        const userAchievement = this.userAchievements.find(ua => ua.achievementId === achievementId);
        
        if (!achievement) return;
        
        // 创建模态框显示成就详情
        const modal = this.createAchievementModal(achievement, userAchievement);
        document.body.appendChild(modal);
        
        // 显示模态框
        setTimeout(() => {
            modal.classList.add('active');
        }, 100);
    }

    createAchievementModal(achievement, userAchievement) {
        const isUnlocked = !!userAchievement;
        const rarity = achievement.rarity || 'bronze';
        
        const modal = document.createElement('div');
        modal.className = 'achievement-modal';
        modal.innerHTML = `
            <div class="achievement-modal-content">
                <button class="achievement-modal-close" onclick="this.closest('.achievement-modal').remove()">×</button>
                
                <div class="achievement-header">
                    <div class="achievement-badge ${rarity} ${isUnlocked ? 'unlocked' : ''}" style="width: 80px; height: 80px; font-size: 2rem;">
                        ${achievement.icon || '🏆'}
                    </div>
                    <div class="achievement-info">
                        <div class="achievement-title">${achievement.name}</div>
                        <div class="achievement-type">${this.getCategoryName(achievement.category)}</div>
                    </div>
                </div>
                
                <div class="achievement-description">${achievement.description}</div>
                
                ${achievement.condition ? `
                    <div class="achievement-condition">
                        <h4>解锁条件:</h4>
                        <p>${this.formatCondition(achievement.condition)}</p>
                    </div>
                ` : ''}
                
                ${achievement.rewards ? `
                    <div class="achievement-rewards">
                        <h4>奖励:</h4>
                        ${achievement.rewards.points ? `<span class="reward-item points">+${achievement.rewards.points} 积分</span>` : ''}
                        ${achievement.rewards.title ? `<span class="reward-item">${achievement.rewards.title}</span>` : ''}
                    </div>
                ` : ''}
                
                ${isUnlocked ? `
                    <div class="achievement-unlock-time">
                        解锁于 ${this.formatDate(userAchievement.unlockedAt)}
                    </div>
                ` : ''}
            </div>
        `;
        
        return modal;
    }

    formatCondition(condition) {
        switch (condition.type) {
            case 'answer_count':
                return `累计答题 ${condition.target} 次`;
            case 'correct_streak':
                return `连续答对 ${condition.target} 道题目`;
            case 'answer_speed':
                return `在 ${condition.target} 秒内答对题目`;
            case 'session_accuracy':
                return `单次答题准确率达到 ${condition.target}%`;
            case 'time_based':
                return `在 ${condition.timeRange} 期间答对 ${condition.target} 道题目`;
            default:
                return '完成特定条件';
        }
    }

    showAchievementNotification(achievement) {
        const notification = this.createAchievementNotification(achievement);
        const container = document.getElementById('achievement-notification-container');
        if (!container) return;
        
        container.appendChild(notification);
        
        // 添加动画效果
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.5s ease-out';
        }, 100);
        
        // 自动移除通知
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
    }

    createAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification-header">
                <div class="achievement-notification-icon">🎉</div>
                <div class="achievement-notification-title">成就解锁!</div>
            </div>
            
            <div class="achievement-notification-content">
                <div class="achievement-notification-badge">
                    ${achievement.icon || '🏆'}
                </div>
                <div class="achievement-notification-name">${achievement.name}</div>
                <div class="achievement-notification-description">${achievement.description}</div>
            </div>
            
            ${achievement.rewards ? `
                <div class="achievement-notification-rewards">
                    ${achievement.rewards.points ? `<span class="reward-item points">+${achievement.rewards.points} 积分</span>` : ''}
                    ${achievement.rewards.title ? `<span class="reward-item">${achievement.rewards.title}</span>` : ''}
                </div>
            ` : ''}
            
            <div class="achievement-notification-actions">
                <button class="achievement-notification-btn" onclick="window.open('/achievements', '_blank')">查看成就</button>
                <button class="achievement-notification-btn" onclick="this.closest('.achievement-notification').remove()">关闭</button>
            </div>
        `;
        
        return notification;
    }

    addToNotificationQueue(data) {
        this.notificationQueue.push(data);
    }

    processNotificationQueue() {
        if (this.isProcessingNotifications || this.notificationQueue.length === 0) {
            setTimeout(() => this.processNotificationQueue(), 1000);
            return;
        }
        
        this.isProcessingNotifications = true;
        const notification = this.notificationQueue.shift();
        
        // 处理通知逻辑
        console.log('处理成就通知:', notification);
        
        this.isProcessingNotifications = false;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 刷新成就数据
    async refreshAchievements() {
        try {
            await this.loadAchievements();
            await this.loadUserAchievements();
            this.updateStats();
            this.renderAchievements();
            
            // 显示刷新成功提示
            this.showRefreshSuccess();
        } catch (error) {
            console.error('刷新成就失败:', error);
            this.showRefreshError();
        }
    }

    showRefreshSuccess() {
        this.showToast('成就数据已更新', 'success');
    }

    showRefreshError() {
        this.showToast('刷新失败，请稍后重试', 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            z-index: 10000;
            animation: slideInDown 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutUp 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// 全局函数
function refreshAchievements() {
    if (window.achievementSystem) {
        window.achievementSystem.refreshAchievements();
    }
}

// 初始化成就系统
document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem = new AchievementSystem();
});

// 导出成就系统类（供其他页面使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AchievementSystem;
}