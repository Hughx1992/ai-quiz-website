// 全局变量
let socket;
let userCount = 0;
let questionCount = 0;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSocket();
    loadQRCode();
    loadQuestionCount();
    loadLeaderboard();
});

// 初始化Socket连接
function initializeSocket() {
    socket = io();
    
    // 监听用户数量更新
    socket.on('user-count-updated', function(count) {
        userCount = count;
        updateUserCount();
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
    
    // 连接状态监听
    socket.on('connect', function() {
        console.log('Connected to server');
        updateQuizStatus('等待开始');
    });
    
    socket.on('disconnect', function() {
        console.log('Disconnected from server');
        updateQuizStatus('连接断开');
    });
}

// 加载二维码
async function loadQRCode() {
    try {
        const response = await fetch('/api/qrcode');
        const data = await response.json();
        
        if (data.qrCode) {
            document.getElementById('qr-code').innerHTML = 
                `<img src="${data.qrCode}" alt="答题二维码">`;
            document.getElementById('quiz-url').textContent = data.url;
        }
    } catch (error) {
        console.error('Failed to load QR code:', error);
        document.getElementById('qr-code').innerHTML = 
            '<div class="error">二维码加载失败</div>';
    }
}

// 加载题目数量
async function loadQuestionCount() {
    try {
        const response = await fetch('/api/questions');
        const questions = await response.json();
        questionCount = questions.length;
        updateQuestionCount();
    } catch (error) {
        console.error('Failed to load question count:', error);
    }
}

// 加载排行榜
async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaderboard = await response.json();
        updateLeaderboard(leaderboard);
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
    }
}

// 更新用户数量显示
function updateUserCount() {
    document.getElementById('user-count').textContent = userCount;
}

// 更新题目数量显示
function updateQuestionCount() {
    document.getElementById('question-count').textContent = questionCount;
}

// 更新竞赛状态显示
function updateQuizStatus(status) {
    const statusElement = document.getElementById('quiz-status');
    statusElement.textContent = status;
    
    // 根据状态设置不同的样式
    statusElement.className = 'stat-status';
    switch(status) {
        case '进行中':
            statusElement.style.background = 'rgba(40, 167, 69, 0.8)';
            break;
        case '已结束':
            statusElement.style.background = 'rgba(220, 53, 69, 0.8)';
            break;
        case '等待开始':
            statusElement.style.background = 'rgba(255, 193, 7, 0.8)';
            break;
        default:
            statusElement.style.background = 'rgba(108, 117, 125, 0.8)';
    }
}

// 更新排行榜显示
function updateLeaderboard(leaderboard) {
    const leaderboardElement = document.getElementById('leaderboard');
    
    if (!leaderboard || leaderboard.length === 0) {
        leaderboardElement.innerHTML = '<div class="no-data">暂无排名数据</div>';
        return;
    }
    
    let html = '';
    leaderboard.forEach((user, index) => {
        const rank = index + 1;
        let rankClass = '';
        let rankIcon = '';
        
        switch(rank) {
            case 1:
                rankClass = 'first';
                rankIcon = '🥇';
                break;
            case 2:
                rankClass = 'second';
                rankIcon = '🥈';
                break;
            case 3:
                rankClass = 'third';
                rankIcon = '🥉';
                break;
            default:
                rankIcon = rank;
        }
        
        html += `
            <div class="leaderboard-item">
                <div class="rank ${rankClass}">${rankIcon}</div>
                <div class="user-info">
                    <div class="nickname">${escapeHtml(user.nickname)}</div>
                    <div class="stats">答题数: ${user.answeredCount || 0}</div>
                </div>
                <div class="score">${user.score}分</div>
            </div>
        `;
    });
    
    leaderboardElement.innerHTML = html;
}

// HTML转义函数，防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 刷新二维码
function refreshQRCode() {
    document.getElementById('qr-code').innerHTML = 
        '<div class="loading">正在生成二维码...</div>';
    loadQRCode();
}

// 定期更新数据
setInterval(() => {
    loadLeaderboard();
}, 5000); // 每5秒更新一次排行榜

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面变为可见时，重新加载数据
        loadLeaderboard();
        loadQuestionCount();
    }
});
