// 全局变量
let socket;
let questions = [];
let currentQuizStatus = false;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeSocket();
    setupEventListeners();
    loadInitialData();
});

// 初始化Socket连接
function initializeSocket() {
    socket = io();
    
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
        updateQuizStatus(true);
    });

    // 监听管理员专用的题目信息（包含答案）
    socket.on('admin-question-started', function(data) {
        displayCurrentQuestion(data.question);
    });

    socket.on('quiz-stopped', function() {
        updateQuizStatus(false);
        clearCurrentQuestion();
    });
    
    // 连接状态监听
    socket.on('connect', function() {
        console.log('Connected to server');
        refreshStatus();
    });
    
    socket.on('disconnect', function() {
        console.log('Disconnected from server');
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 竞赛控制按钮
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    document.getElementById('next-question-btn').addEventListener('click', nextQuestion);
    document.getElementById('stop-quiz-btn').addEventListener('click', stopQuiz);
    document.getElementById('refresh-status-btn').addEventListener('click', refreshStatus);
    
    // 题目表单提交
    document.getElementById('question-form').addEventListener('submit', addQuestion);

    // AI题目生成按钮
    document.getElementById('generate-questions-btn').addEventListener('click', generateQuestions);

    // 清空排行榜按钮
    document.getElementById('clear-leaderboard-btn').addEventListener('click', clearLeaderboard);
}

// 加载初始数据
async function loadInitialData() {
    await loadQuestions();
    await loadLeaderboard();
    await refreshStatus();
}

// 开始竞赛
async function startQuiz() {
    if (questions.length === 0) {
        showMessage('没有可用的题目，请先添加题目！', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/start-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('竞赛已开始！', 'success');
            updateQuizStatus(true);
            // 不需要在这里显示题目，因为会通过socket事件接收
        } else {
            showMessage(result.error || '开始竞赛失败', 'error');
        }
    } catch (error) {
        console.error('Start quiz error:', error);
        showMessage('开始竞赛失败', 'error');
    }
}

// 下一题
async function nextQuestion() {
    try {
        const response = await fetch('/api/admin/next-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            showMessage('已发送下一题！', 'success');
            // 不需要在这里显示题目，因为会通过socket事件接收
        } else {
            showMessage(result.error || '获取下一题失败', 'error');
        }
    } catch (error) {
        console.error('Next question error:', error);
        showMessage('获取下一题失败', 'error');
    }
}

// 结束竞赛
async function stopQuiz() {
    try {
        const response = await fetch('/api/admin/stop-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            showMessage('竞赛已结束！', 'info');
            updateQuizStatus(false);
            clearCurrentQuestion();
        } else {
            showMessage('结束竞赛失败', 'error');
        }
    } catch (error) {
        console.error('Stop quiz error:', error);
        showMessage('结束竞赛失败', 'error');
    }
}

// 刷新状态
async function refreshStatus() {
    try {
        const response = await fetch('/api/admin/status');
        const status = await response.json();
        
        updateQuizStatus(status.quizActive);
        document.getElementById('user-count').textContent = status.connectedUsers;

        // 如果有当前题目，需要获取完整的题目信息
        if (status.currentQuestion) {
            // 从题目列表中找到完整的题目信息
            loadQuestions().then(() => {
                const fullQuestion = questions.find(q => q.id === status.currentQuestion.id);
                if (fullQuestion) {
                    displayCurrentQuestion(fullQuestion);
                } else {
                    // 如果找不到完整信息，显示基本信息
                    displayCurrentQuestion(status.currentQuestion);
                }
            });
        } else {
            clearCurrentQuestion();
        }
    } catch (error) {
        console.error('Refresh status error:', error);
    }
}

// 更新竞赛状态显示
function updateQuizStatus(isActive) {
    currentQuizStatus = isActive;
    const statusElement = document.getElementById('quiz-status');
    const startBtn = document.getElementById('start-quiz-btn');
    const nextBtn = document.getElementById('next-question-btn');
    const stopBtn = document.getElementById('stop-quiz-btn');

    if (isActive) {
        statusElement.textContent = '进行中';
        statusElement.style.color = '#28a745';
        startBtn.disabled = true;
        nextBtn.disabled = false;
        stopBtn.disabled = false;
    } else {
        statusElement.textContent = '未开始';
        statusElement.style.color = '#6c757d';
        startBtn.disabled = false;
        nextBtn.disabled = true;
        stopBtn.disabled = true;
    }
}

// 显示当前题目
function displayCurrentQuestion(question) {
    const container = document.getElementById('current-question-display');

    let optionsHtml = '';
    if (question.options) {
        question.options.forEach((option, index) => {
            const isCorrect = index === question.correctAnswer;
            optionsHtml += `
                <div class="option ${isCorrect ? 'correct' : ''}">
                    ${String.fromCharCode(65 + index)}. ${option}
                    ${isCorrect ? ' ✅ 正确答案' : ''}
                </div>
            `;
        });
    }

    const correctAnswerLetter = question.correctAnswer !== undefined ?
        String.fromCharCode(65 + question.correctAnswer) : '未知';

    container.innerHTML = `
        <div class="current-question">
            <h4>${question.title}</h4>
            ${question.image ? `<img src="${question.image}" alt="题目图片" style="max-width: 200px; margin: 10px 0;">` : ''}
            <div class="question-meta">
                <span class="answer-info">正确答案：${correctAnswerLetter} (索引: ${question.correctAnswer})</span>
                <span class="category-info">分类：${question.category || '未分类'}</span>
                <span class="difficulty-info">难度：${question.difficulty || '中等'}</span>
            </div>
            <div class="options">${optionsHtml}</div>
        </div>
    `;

    // 显示答案解释
    const explanationSection = document.getElementById('admin-explanation');
    const explanationText = document.getElementById('explanation-text');

    if (question.explanation && explanationSection && explanationText) {
        explanationText.textContent = question.explanation;
        explanationSection.style.display = 'block';
    } else {
        explanationSection.style.display = 'none';
    }
}

// 清除当前题目显示
function clearCurrentQuestion() {
    document.getElementById('current-question-display').innerHTML =
        '<div class="no-question">暂无进行中的题目</div>';

    // 隐藏答案解释
    const explanationSection = document.getElementById('admin-explanation');
    if (explanationSection) {
        explanationSection.style.display = 'none';
    }
}

// AI生成题目
async function generateQuestions() {
    const theme = document.getElementById('generate-theme').value;
    const count = parseInt(document.getElementById('generate-count').value);
    const difficulty = document.getElementById('generate-difficulty').value;

    const generateBtn = document.getElementById('generate-questions-btn');
    const originalText = generateBtn.textContent;

    try {
        generateBtn.disabled = true;
        generateBtn.textContent = '生成中...';

        const response = await fetch('/api/generate-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                theme: theme,
                count: count,
                difficulty: difficulty
            })
        });

        const result = await response.json();

        if (result.success) {
            showMessage(`成功生成 ${result.generated} 道题目！`, 'success');
            await loadQuestions();
        } else {
            showMessage(result.error || 'AI题目生成失败', 'error');
        }
    } catch (error) {
        console.error('Generate questions error:', error);
        showMessage('AI题目生成失败', 'error');
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = originalText;
    }
}

// 添加题目
async function addQuestion(event) {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('question-title').value);
    formData.append('correctAnswer', document.getElementById('correct-answer').value);
    formData.append('category', document.getElementById('question-category').value);
    formData.append('difficulty', document.getElementById('question-difficulty').value);
    
    // 收集选项
    const options = [];
    for (let i = 0; i < 4; i++) {
        const option = document.getElementById(`option-${i}`).value.trim();
        if (!option) {
            showMessage(`请填写选项${String.fromCharCode(65 + i)}`, 'error');
            return;
        }
        options.push(option);
    }
    formData.append('options', JSON.stringify(options));
    
    // 添加图片（如果有）
    const imageFile = document.getElementById('question-image').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    try {
        const response = await fetch('/api/questions', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('题目添加成功！', 'success');
            document.getElementById('question-form').reset();
            await loadQuestions();
        } else {
            showMessage(result.error || '添加题目失败', 'error');
        }
    } catch (error) {
        console.error('Add question error:', error);
        showMessage('添加题目失败', 'error');
    }
}

// 加载题目列表
async function loadQuestions() {
    try {
        const response = await fetch('/api/questions');
        questions = await response.json();
        
        document.getElementById('question-count').textContent = questions.length;
        displayQuestionList(questions);
    } catch (error) {
        console.error('Load questions error:', error);
        showMessage('加载题目失败', 'error');
    }
}

// 显示题目列表
function displayQuestionList(questions) {
    const container = document.getElementById('question-list');
    
    if (questions.length === 0) {
        container.innerHTML = '<div class="no-data">暂无题目</div>';
        return;
    }
    
    let html = '';
    questions.forEach((question, index) => {
        html += `
            <div class="question-item">
                <h4>${question.title}</h4>
                <div class="question-meta">
                    <span>分类: ${question.category}</span>
                    <span>难度: ${question.difficulty}</span>
                    <span>创建时间: ${new Date(question.createdAt).toLocaleString()}</span>
                </div>
                <div class="question-actions">
                    <button class="btn btn-sm btn-warning" onclick="editQuestion('${question.id}')">编辑</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteQuestion('${question.id}')">删除</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 编辑题目（简化版，实际应该弹出编辑表单）
function editQuestion(questionId) {
    showMessage('编辑功能开发中...', 'info');
}

// 删除题目
async function deleteQuestion(questionId) {
    if (!confirm('确定要删除这道题目吗？')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/questions/${questionId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('题目删除成功！', 'success');
            await loadQuestions();
        } else {
            showMessage('删除题目失败', 'error');
        }
    } catch (error) {
        console.error('Delete question error:', error);
        showMessage('删除题目失败', 'error');
    }
}

// 加载排行榜
async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaderboard = await response.json();
        updateLeaderboard(leaderboard);
    } catch (error) {
        console.error('Load leaderboard error:', error);
    }
}

// 更新排行榜显示
function updateLeaderboard(leaderboard) {
    const container = document.getElementById('admin-leaderboard');
    
    if (!leaderboard || leaderboard.length === 0) {
        container.innerHTML = '<div class="no-data">暂无排名数据</div>';
        return;
    }
    
    let html = '';
    leaderboard.forEach((user, index) => {
        html += `
            <div class="leaderboard-item">
                <div class="rank">${index + 1}</div>
                <div class="user-info">
                    <div class="nickname">${escapeHtml(user.nickname)}</div>
                    <div class="stats">答题数: ${user.answeredCount || 0}</div>
                </div>
                <div class="score">${user.score}分</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// 显示消息提示
function showMessage(message, type = 'info') {
    const toast = document.getElementById('message-toast');
    const text = document.getElementById('message-text');
    
    text.textContent = message;
    toast.className = `message-toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 清空排行榜
async function clearLeaderboard() {
    if (!confirm('确定要清空排行榜吗？这将删除所有用户数据和答题记录，此操作不可恢复！')) {
        return;
    }

    try {
        const response = await fetch('/api/admin/clear-leaderboard', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            showMessage('排行榜已清空！', 'success');
            await loadLeaderboard();
            document.getElementById('user-count').textContent = '0';
        } else {
            showMessage('清空排行榜失败', 'error');
        }
    } catch (error) {
        console.error('Clear leaderboard error:', error);
        showMessage('清空排行榜失败', 'error');
    }
}

// 定期更新数据
setInterval(() => {
    loadLeaderboard();
    refreshStatus();
}, 5000);
