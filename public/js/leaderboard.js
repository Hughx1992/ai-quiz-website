// 全局变量
let socket;
let currentLeaderboard = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSocket();
    createParticles();
    loadInitialData();
    updateTime();
    
    // 每秒更新时间
    setInterval(updateTime, 1000);
});

// 初始化Socket连接
function initializeSocket() {
    socket = io();
    
    // 连接状态监听
    socket.on('connect', function() {
        console.log('Connected to server');
        updateConnectionStatus(true);
    });
    
    socket.on('disconnect', function() {
        console.log('Disconnected from server');
        updateConnectionStatus(false);
    });
    
    // 监听用户数量更新
    socket.on('user-count-updated', function(count) {
        document.getElementById('user-count').textContent = count;
    });
    
    // 监听排行榜更新
    socket.on('leaderboard-updated', function(leaderboard) {
        updateLeaderboard(leaderboard);
    });
    
    // 监听竞赛状态更新
    socket.on('quiz-started', function(data) {
        updateQuizStatus('进行中');
    });
    
    socket.on('quiz-stopped', function() {
        updateQuizStatus('已结束');
    });
}

// 创建粒子背景
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // 随机动画延迟
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// 加载初始数据
async function loadInitialData() {
    await loadLeaderboard();
    await loadStatus();
}

// 加载排行榜数据
async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaderboard = await response.json();
        updateLeaderboard(leaderboard);
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
    }
}

// 加载状态信息
async function loadStatus() {
    try {
        const response = await fetch('/api/admin/status');
        const status = await response.json();
        
        updateQuizStatus(status.quizActive ? '进行中' : '等待开始');
        document.getElementById('user-count').textContent = status.connectedUsers;
    } catch (error) {
        console.error('Failed to load status:', error);
    }
}

// 更新排行榜显示
function updateLeaderboard(leaderboard) {
    currentLeaderboard = leaderboard || [];
    
    // 更新领奖台
    updatePodium(currentLeaderboard);
    
    // 更新完整排名列表
    updateRankingList(currentLeaderboard);
}

// 更新领奖台显示
function updatePodium(leaderboard) {
    const positions = ['first-place', 'second-place', 'third-place'];
    
    positions.forEach((position, index) => {
        const element = document.getElementById(position);
        const nameElement = element.querySelector('.podium-name');
        const scoreElement = element.querySelector('.podium-score');
        
        if (leaderboard[index]) {
            const user = leaderboard[index];
            nameElement.textContent = user.nickname;
            scoreElement.textContent = user.score + '分';
            
            // 添加动画效果
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'slideUp 1s ease-out';
            }, index * 200);
        } else {
            nameElement.textContent = '--';
            scoreElement.textContent = '0分';
        }
    });
}

// 更新完整排名列表
function updateRankingList(leaderboard) {
    const container = document.getElementById('ranking-list');
    
    if (!leaderboard || leaderboard.length === 0) {
        container.innerHTML = '<div class="no-data">暂无排名数据</div>';
        return;
    }
    
    let html = '';
    leaderboard.forEach((user, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;
        
        html += `
            <div class="ranking-item" style="animation-delay: ${index * 0.1}s">
                <div class="ranking-number ${isTop3 ? 'top3' : ''}">${rank}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${escapeHtml(user.nickname)}</div>
                    <div class="ranking-stats">答题数: ${user.answeredCount || 0}</div>
                </div>
                <div class="ranking-score">${user.score}分</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 更新竞赛状态
function updateQuizStatus(status) {
    const statusElement = document.getElementById('quiz-status');
    statusElement.textContent = status;
    
    // 根据状态设置颜色
    switch(status) {
        case '进行中':
            statusElement.style.color = '#28a745';
            break;
        case '已结束':
            statusElement.style.color = '#dc3545';
            break;
        case '等待开始':
            statusElement.style.color = '#ffc107';
            break;
        default:
            statusElement.style.color = '#6c757d';
    }
}

// 更新连接状态
function updateConnectionStatus(connected) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('connection-text');
    
    if (connected) {
        statusDot.classList.remove('disconnected');
        statusText.textContent = '已连接';
    } else {
        statusDot.classList.add('disconnected');
        statusText.textContent = '连接断开';
    }
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('update-time').textContent = timeString;
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 全屏切换功能
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// 键盘事件监听
document.addEventListener('keydown', function(event) {
    // F11 或 F 键切换全屏
    if (event.key === 'F11' || event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        toggleFullscreen();
    }
    
    // R 键刷新数据
    if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        loadLeaderboard();
        loadStatus();
    }
    
    // ESC 键退出全屏
    if (event.key === 'Escape') {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面变为可见时，重新加载数据
        loadLeaderboard();
        loadStatus();
        
        // 重新连接socket（如果断开）
        if (socket && !socket.connected) {
            socket.connect();
        }
    }
});

// 定期更新数据
setInterval(() => {
    if (!document.hidden) {
        loadLeaderboard();
        loadStatus();
    }
}, 3000); // 每3秒更新一次

// 窗口大小变化时重新创建粒子
window.addEventListener('resize', function() {
    const particlesContainer = document.getElementById('particles');
    particlesContainer.innerHTML = '';
    createParticles();
});

// 添加一些视觉效果
function addVisualEffects() {
    // 为排名变化添加闪烁效果
    const rankingItems = document.querySelectorAll('.ranking-item');
    rankingItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
        });
    });
}

// 页面加载完成后添加视觉效果
setTimeout(addVisualEffects, 1000);
