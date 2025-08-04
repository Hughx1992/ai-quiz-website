// 全局变量
let socket;
let currentUser = null;
let currentQuestion = null;
let selectedAnswer = null;
let timer = null;
let timeLeft = 30;
let isTimedOut = false;
let questionStartTime = null;
let achievementSystem = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSocket();
    setupEventListeners();
    initializeAchievementSystem();
    showScreen('login-screen');
});

// 初始化Socket连接
function initializeSocket() {
    socket = io();
    
    // 连接状态监听
    socket.on('connect', function() {
        console.log('Connected to server');
        updateConnectionStatus('connected');
    });
    
    socket.on('disconnect', function() {
        console.log('Disconnected from server');
        updateConnectionStatus('disconnected');
    });
    
    // 用户加入成功
    socket.on('user-joined', function(user) {
        currentUser = user;
        document.getElementById('user-nickname').textContent = user.nickname;
        document.getElementById('user-score').textContent = user.score;
        showScreen('waiting-screen');
    });
    
    // 竞赛开始
    socket.on('quiz-started', function(data) {
        currentQuestion = data.question;
        displayQuestion(currentQuestion);
        showScreen('quiz-screen');
        startTimer();
    });
    
    // 竞赛停止
    socket.on('quiz-stopped', function() {
        showScreen('end-screen');
        document.getElementById('final-score').textContent = currentUser ? currentUser.score : 0;
        stopTimer();
    });
    
    // 答题结果
    socket.on('answer-result', function(result) {
        // 只更新用户得分，不显示结果页面
        if (currentUser) {
            currentUser.score = result.totalScore;
        }

        // 更新得分显示
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
            scoreElement.textContent = result.totalScore;
        }

        stopTimer();
    });
    
    // 用户数量更新
    socket.on('user-count-updated', function(count) {
        document.getElementById('online-users').textContent = count;
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 加入竞赛按钮
    document.getElementById('join-btn').addEventListener('click', joinQuiz);
    
    // 昵称输入框回车事件
    document.getElementById('nickname-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinQuiz();
        }
    });
    
    // 提交答案按钮
    document.getElementById('submit-btn').addEventListener('click', submitAnswer);
    
    // 继续按钮
    document.getElementById('continue-btn').addEventListener('click', function() {
        showScreen('waiting-screen');
    });

    // 自动返回等待界面（3秒后）
    let autoReturnTimer = null;
    
    // 查看排行榜按钮
    document.getElementById('view-leaderboard-btn').addEventListener('click', function() {
        window.open('/leaderboard', '_blank');
    });
    
    // 重新开始按钮
    document.getElementById('restart-btn').addEventListener('click', function() {
        location.reload();
    });
}

// 加入竞赛
function joinQuiz() {
    const nickname = document.getElementById('nickname-input').value.trim();
    
    if (!nickname) {
        alert('请输入您的昵称！');
        return;
    }
    
    if (nickname.length > 20) {
        alert('昵称长度不能超过20个字符！');
        return;
    }
    
    // 禁用按钮，防止重复点击
    document.getElementById('join-btn').disabled = true;
    document.getElementById('join-btn').textContent = '加入中...';
    
    socket.emit('join-quiz', { nickname: nickname });
}

// 显示指定屏幕
function showScreen(screenId) {
    // 隐藏所有屏幕
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // 显示指定屏幕
    document.getElementById(screenId).classList.add('active');
}

// 显示题目
function displayQuestion(question) {
    // 记录题目开始时间
    questionStartTime = Date.now();
    
    document.getElementById('question-title').textContent = question.title;

    // 显示图片（如果有）
    const imageContainer = document.getElementById('question-image');
    if (question.image) {
        document.getElementById('question-img').src = question.image;
        imageContainer.style.display = 'block';
    } else {
        imageContainer.style.display = 'none';
    }

    // 显示选项
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        button.onclick = () => selectOption(index, button);
        optionsContainer.appendChild(button);
    });

    // 重置所有状态
    resetQuestionState();

    // 更新得分显示
    document.getElementById('current-score').textContent = currentUser ? currentUser.score : 0;
}

// 重置题目状态
function resetQuestionState() {
    selectedAnswer = null;
    isTimedOut = false;

    // 重置提交按钮
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交答案';
    submitBtn.style.background = '';
    submitBtn.style.opacity = '';
    submitBtn.style.cursor = '';

    // 重置所有选项
    const options = document.querySelectorAll('.option');
    options.forEach(opt => {
        opt.disabled = false;
        opt.style.opacity = '';
        opt.style.cursor = '';
        opt.classList.remove('selected');
    });

    // 重置计时器显示
    const timerElement = document.getElementById('timer');
    timerElement.style.color = '#28a745';
    timerElement.style.fontWeight = 'normal';
    timerElement.style.animation = 'none';

    // 清除等待提示
    const waitingHint = document.getElementById('waiting-hint');
    if (waitingHint) {
        waitingHint.style.display = 'none';
    }
}

// 选择选项
function selectOption(index, button) {
    // 检查是否已超时
    if (isTimedOut) {
        return;
    }

    // 移除其他选项的选中状态
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.classList.remove('selected'));

    // 设置当前选项为选中状态
    button.classList.add('selected');
    selectedAnswer = index;

    // 启用提交按钮
    document.getElementById('submit-btn').disabled = false;
}

// 提交答案
function submitAnswer() {
    if (isTimedOut) {
        alert('答题时间已结束！');
        return;
    }

    if (selectedAnswer === null) {
        alert('请选择一个答案！');
        return;
    }

    // 禁用所有选项和提交按钮
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.disabled = true);
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('submit-btn').textContent = '已提交';

    const answerData = {
        questionId: currentQuestion.id,
        selectedAnswer: selectedAnswer,
        answerTime: Date.now(),
        questionStartTime: questionStartTime
    };

    // 发送答案到服务器
    socket.emit('submit-answer', answerData);

    // 检查成就
    checkAchievements('submit_answer', answerData);

    stopTimer();

    // 直接显示等待下一题状态
    showWaitingForNext();
}

// 显示等待下一题状态
function showWaitingForNext() {
    // 更新提交按钮文本和样式
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = '等待下一题...';
    submitBtn.style.background = '#6c757d';
    submitBtn.style.cursor = 'not-allowed';

    // 显示等待提示
    const questionTitle = document.getElementById('question-title');
    const originalTitle = questionTitle.textContent;

    // 添加等待提示到题目标题下方
    let waitingHint = document.getElementById('waiting-hint');
    if (!waitingHint) {
        waitingHint = document.createElement('div');
        waitingHint.id = 'waiting-hint';
        waitingHint.style.cssText = `
            text-align: center;
            color: #6c757d;
            font-size: 16px;
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px dashed #dee2e6;
        `;
        questionTitle.parentNode.insertBefore(waitingHint, questionTitle.nextSibling);
    }

    waitingHint.innerHTML = `
        <div style="margin-bottom: 10px;">📝 答案已提交</div>
        <div style="font-size: 14px; color: #868e96;">请等待管理员推送下一题...</div>
    `;
    waitingHint.style.display = 'block';
}

// 显示答题结果
function displayResult(result) {
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const questionPoints = document.getElementById('question-points');
    const totalScore = document.getElementById('total-score');
    const correctAnswerSection = document.getElementById('correct-answer-section');
    const correctAnswer = document.getElementById('correct-answer');

    if (result.isTimeout) {
        resultIcon.textContent = '⏰';
        resultTitle.textContent = '答题超时';
        resultMessage.textContent = '很遗憾，您没有在规定时间内完成答题。';
        resultIcon.style.color = '#ffc107';
    } else if (result.isCorrect) {
        resultIcon.textContent = '🎉';
        resultTitle.textContent = '回答正确！';
        resultMessage.textContent = '恭喜您答对了这道题！';
        resultIcon.style.color = '#28a745';
    } else {
        resultIcon.textContent = '😔';
        resultTitle.textContent = '回答错误';
        resultMessage.textContent = '很遗憾，这次没有答对。';
        resultIcon.style.color = '#dc3545';
    }

    // 显示正确答案（除非答对了）
    if (!result.isCorrect && currentQuestion && currentQuestion.options) {
        const correctOption = currentQuestion.options[result.correctAnswer];
        correctAnswer.textContent = `${String.fromCharCode(65 + result.correctAnswer)}. ${correctOption}`;
        correctAnswerSection.style.display = 'block';
    } else {
        correctAnswerSection.style.display = 'none';
    }

    questionPoints.textContent = result.points;
    totalScore.textContent = result.totalScore;
}

// 开始计时器
function startTimer() {
    timeLeft = 30;
    isTimedOut = false;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            // 时间到，锁定答题
            stopTimer();
            isTimedOut = true;
            lockAnswering();

            // 自动提交答案（如果有选择）或提交超时状态
            socket.emit('submit-answer', {
                questionId: currentQuestion.id,
                selectedAnswer: selectedAnswer !== null ? selectedAnswer : -1, // -1表示未选择或超时
                answerTime: Date.now(),
                isTimeout: true
            });

            // 显示等待下一题状态
            showWaitingForNext();
        }
    }, 1000);
}

// 锁定答题功能
function lockAnswering() {
    const options = document.querySelectorAll('.option');
    const submitBtn = document.getElementById('submit-btn');

    // 禁用所有选项
    options.forEach(opt => {
        opt.disabled = true;
        opt.style.opacity = '0.5';
        opt.style.cursor = 'not-allowed';
    });

    // 禁用提交按钮
    submitBtn.disabled = true;
    submitBtn.textContent = '答题超时';
    submitBtn.style.background = '#dc3545';
}

// 停止计时器
function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// 更新计时器显示
function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = timeLeft;

    // 根据剩余时间改变颜色和样式
    if (timeLeft <= 5) {
        timerElement.style.color = '#dc3545';
        timerElement.style.fontWeight = 'bold';
        timerElement.style.animation = 'pulse 1s infinite';
    } else if (timeLeft <= 15) {
        timerElement.style.color = '#ffc107';
        timerElement.style.fontWeight = 'bold';
        timerElement.style.animation = 'none';
    } else {
        timerElement.style.color = '#28a745';
        timerElement.style.fontWeight = 'normal';
        timerElement.style.animation = 'none';
    }
}

// 更新连接状态
function updateConnectionStatus(status) {
    const statusElement = document.getElementById('connection-status');
    const statusText = document.getElementById('status-text');
    
    statusElement.className = `connection-status ${status}`;
    
    switch(status) {
        case 'connected':
            statusText.textContent = '已连接';
            break;
        case 'disconnected':
            statusText.textContent = '连接断开';
            break;
        case 'connecting':
            statusText.textContent = '连接中...';
            break;
    }
}

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停计时器（可选）
    } else {
        // 页面显示时恢复
        if (socket && !socket.connected) {
            socket.connect();
        }
    }
});

// 页面卸载前的处理
window.addEventListener('beforeunload', function() {
    if (socket) {
        socket.disconnect();
    }
});

// 成就系统相关函数
function initializeAchievementSystem() {
    // 等待成就系统加载完成
    if (typeof AchievementSystem !== 'undefined') {
        achievementSystem = new AchievementSystem();
    } else {
        // 如果成就系统还未加载，稍后重试
        setTimeout(initializeAchievementSystem, 100);
    }
}

function checkAchievements(action, data) {
    if (!achievementSystem || !currentUser) return;
    
    // 向服务器发送成就检查请求
    fetch('/api/check-achievements', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: currentUser.id,
            action: action,
            data: data
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.newlyUnlocked && result.newlyUnlocked.length > 0) {
            // 显示成就解锁通知
            result.newlyUnlocked.forEach(achievement => {
                showAchievementNotification(achievement);
            });
        }
    })
    .catch(error => {
        console.error('检查成就失败:', error);
    });
}

function showAchievementNotification(achievement) {
    if (!achievementSystem) return;
    
    // 使用成就系统的通知功能
    achievementSystem.showAchievementNotification(achievement);
    
    // 播放成就解锁音效（如果有）
    playAchievementSound();
}

function playAchievementSound() {
    // 创建简单的音效
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}
