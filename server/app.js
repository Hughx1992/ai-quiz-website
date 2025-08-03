const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const questionGenerator = require('./question-generator');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === 'production' ? process.env.HOST : null;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 文件上传配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 数据存储路径
const DATA_DIR = path.join(__dirname, '../database');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');
const ANSWERS_FILE = path.join(DATA_DIR, 'answers.json');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

// 确保数据目录和文件存在
async function initializeDataFiles() {
    await fs.ensureDir(DATA_DIR);
    
    const defaultData = {
        users: [],
        questions: [],
        answers: [],
        leaderboard: []
    };
    
    if (!await fs.pathExists(USERS_FILE)) {
        await fs.writeJson(USERS_FILE, defaultData.users);
    }
    if (!await fs.pathExists(QUESTIONS_FILE)) {
        await fs.writeJson(QUESTIONS_FILE, defaultData.questions);
    }
    if (!await fs.pathExists(ANSWERS_FILE)) {
        await fs.writeJson(ANSWERS_FILE, defaultData.answers);
    }
    if (!await fs.pathExists(LEADERBOARD_FILE)) {
        await fs.writeJson(LEADERBOARD_FILE, defaultData.leaderboard);
    }
}

// 数据操作函数
async function readJsonFile(filePath) {
    try {
        return await fs.readJson(filePath);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

async function writeJsonFile(filePath, data) {
    try {
        await fs.writeJson(filePath, data, { spaces: 2 });
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// 全局变量
let currentQuestion = null;
let quizActive = false;
let connectedUsers = new Map();
let usedQuestionIds = new Set(); // 记录已使用的题目ID

// 获取随机不重复题目
function getRandomUniqueQuestion(questions) {
    if (questions.length === 0) return null;

    // 如果所有题目都用过了，重置已使用列表
    if (usedQuestionIds.size >= questions.length) {
        usedQuestionIds.clear();
        console.log('🔄 所有题目已使用完毕，重置题目池');
    }

    // 筛选出未使用的题目
    const availableQuestions = questions.filter(q => !usedQuestionIds.has(q.id));

    if (availableQuestions.length === 0) {
        // 如果没有可用题目，重置并重新筛选
        usedQuestionIds.clear();
        const randomIndex = Math.floor(Math.random() * questions.length);
        const selectedQuestion = questions[randomIndex];
        usedQuestionIds.add(selectedQuestion.id);
        return selectedQuestion;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];

    // 记录已使用的题目
    usedQuestionIds.add(selectedQuestion.id);

    console.log(`📝 选择题目: ${selectedQuestion.title} (剩余未使用: ${questions.length - usedQuestionIds.size})`);

    return selectedQuestion;
}

// 路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/quiz.html'));
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/leaderboard.html'));
});

// 获取访问地址
function getAccessURL() {
    // 云部署环境
    if (process.env.NODE_ENV === 'production') {
        return process.env.APP_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN || process.env.RENDER_EXTERNAL_HOSTNAME || 'your-app.railway.app'}`;
    }

    // 本地开发环境
    const os = require('os');
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const interface of interfaces[name]) {
            // 跳过内部地址和非IPv4地址
            if (interface.family === 'IPv4' && !interface.internal) {
                return `http://${interface.address}:${PORT}`;
            }
        }
    }
    return `http://localhost:${PORT}`;
}

// API路由
app.get('/api/qrcode', async (req, res) => {
    try {
        const baseUrl = getAccessURL();
        const loginUrl = `${baseUrl}/quiz`;
        const qrCodeDataURL = await QRCode.toDataURL(loginUrl);
        res.json({ qrCode: qrCodeDataURL, url: loginUrl });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

app.get('/api/questions', async (req, res) => {
    const questions = await readJsonFile(QUESTIONS_FILE);
    res.json(questions);
});

app.post('/api/questions', upload.single('image'), async (req, res) => {
    try {
        const { title, options, correctAnswer, category, difficulty } = req.body;
        const questions = await readJsonFile(QUESTIONS_FILE);
        
        const newQuestion = {
            id: uuidv4(),
            title,
            options: JSON.parse(options),
            correctAnswer: parseInt(correctAnswer),
            category,
            difficulty,
            image: req.file ? `/uploads/${req.file.filename}` : null,
            createdAt: new Date().toISOString()
        };
        
        questions.push(newQuestion);
        await writeJsonFile(QUESTIONS_FILE, questions);
        
        res.json({ success: true, question: newQuestion });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ error: 'Failed to add question' });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    const leaderboard = await readJsonFile(LEADERBOARD_FILE);
    // 按分数排序，取前5名
    const topFive = leaderboard
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(a.lastAnswerTime) - new Date(b.lastAnswerTime);
        })
        .slice(0, 5);
    res.json(topFive);
});

// Socket.IO 连接处理
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-quiz', async (userData) => {
        const { nickname } = userData;

        // 检查是否已经存在该用户（重新连接的情况）
        let existingUser = null;
        for (const [socketId, user] of connectedUsers.entries()) {
            if (user.nickname === nickname) {
                existingUser = user;
                // 更新socket ID
                connectedUsers.delete(socketId);
                user.socketId = socket.id;
                connectedUsers.set(socket.id, user);
                break;
            }
        }

        if (!existingUser) {
            // 创建新用户
            const userId = uuidv4();
            const user = {
                id: userId,
                socketId: socket.id,
                nickname: nickname || `用户${Math.floor(Math.random() * 1000)}`,
                score: 0,
                answeredQuestions: [],
                joinedAt: new Date().toISOString()
            };

            connectedUsers.set(socket.id, user);

            // 保存用户到文件
            const users = await readJsonFile(USERS_FILE);
            users.push(user);
            await writeJsonFile(USERS_FILE, users);

            socket.emit('user-joined', user);
        } else {
            socket.emit('user-joined', existingUser);
        }

        socket.broadcast.emit('user-count-updated', connectedUsers.size);

        console.log(`User joined: ${nickname} (${connectedUsers.size} total users)`);
    });
    
    socket.on('submit-answer', async (data) => {
        const { questionId, selectedAnswer, answerTime, isTimeout } = data;
        const user = connectedUsers.get(socket.id);

        if (!user || !currentQuestion) return;

        // 处理超时或未选择的情况
        let isCorrect = false;
        let points = 0;

        if (selectedAnswer !== -1 && selectedAnswer !== null && selectedAnswer !== undefined) {
            isCorrect = selectedAnswer === currentQuestion.correctAnswer;
            points = isCorrect ? 10 : 0;
        }

        // 如果超时，不给分
        if (isTimeout) {
            points = 0;
            isCorrect = false;
        }

        user.score += points;
        user.answeredQuestions.push({
            questionId,
            selectedAnswer,
            isCorrect,
            points,
            answerTime,
            isTimeout: isTimeout || false
        });

        // 保存答题记录
        const answers = await readJsonFile(ANSWERS_FILE);
        answers.push({
            userId: user.id,
            questionId,
            selectedAnswer,
            isCorrect,
            points,
            answerTime: new Date().toISOString(),
            isTimeout: isTimeout || false
        });
        await writeJsonFile(ANSWERS_FILE, answers);

        // 更新排行榜
        await updateLeaderboard(user);

        socket.emit('answer-result', {
            isCorrect,
            points,
            correctAnswer: currentQuestion.correctAnswer,
            correctAnswerText: currentQuestion.options[currentQuestion.correctAnswer],
            explanation: currentQuestion.explanation || '暂无解释',
            totalScore: user.score,
            isTimeout: isTimeout || false
        });

        // 广播更新后的排行榜
        const leaderboard = await readJsonFile(LEADERBOARD_FILE);
        const topFive = leaderboard
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return new Date(a.lastAnswerTime) - new Date(b.lastAnswerTime);
            })
            .slice(0, 5);

        io.emit('leaderboard-updated', topFive);
    });
    
    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        socket.broadcast.emit('user-count-updated', connectedUsers.size);
        console.log('User disconnected:', socket.id);
    });
});

async function updateLeaderboard(user) {
    const leaderboard = await readJsonFile(LEADERBOARD_FILE);
    const existingIndex = leaderboard.findIndex(entry => entry.userId === user.id);

    // 计算实际答题数量（从答题记录中统计）
    const answers = await readJsonFile(ANSWERS_FILE);
    const userAnswerCount = answers.filter(answer => answer.userId === user.id).length;

    const leaderboardEntry = {
        userId: user.id,
        nickname: user.nickname,
        score: user.score,
        answeredCount: userAnswerCount,
        lastAnswerTime: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        leaderboard[existingIndex] = leaderboardEntry;
    } else {
        leaderboard.push(leaderboardEntry);
    }

    await writeJsonFile(LEADERBOARD_FILE, leaderboard);
}

// 管理员功能
app.post('/api/admin/start-quiz', async (req, res) => {
    const questions = await readJsonFile(QUESTIONS_FILE);
    if (questions.length === 0) {
        return res.status(400).json({ error: 'No questions available' });
    }

    quizActive = true;
    currentQuestion = getRandomUniqueQuestion(questions);

    io.emit('quiz-started', {
        question: {
            id: currentQuestion.id,
            title: currentQuestion.title,
            options: currentQuestion.options,
            image: currentQuestion.image
        }
    });

    // 向管理员发送完整的题目信息（包含答案）
    io.emit('admin-question-started', {
        question: currentQuestion
    });

    res.json({ success: true, question: currentQuestion });
});

app.post('/api/admin/stop-quiz', (req, res) => {
    quizActive = false;
    currentQuestion = null;
    usedQuestionIds.clear(); // 重置已使用题目列表
    io.emit('quiz-stopped');
    res.json({ success: true });
});

app.post('/api/admin/next-question', async (req, res) => {
    try {
        if (!quizActive) {
            return res.status(400).json({ error: 'Quiz is not active' });
        }

        const questions = await readJsonFile(QUESTIONS_FILE);
        if (questions.length === 0) {
            return res.status(400).json({ error: 'No questions available' });
        }

        // 随机选择下一题（避免重复）
        currentQuestion = getRandomUniqueQuestion(questions);

        io.emit('quiz-started', {
            question: {
                id: currentQuestion.id,
                title: currentQuestion.title,
                options: currentQuestion.options,
                image: currentQuestion.image
            }
        });

        // 向管理员发送完整的题目信息（包含答案）
        io.emit('admin-question-started', {
            question: currentQuestion
        });

        res.json({ success: true, question: currentQuestion });
    } catch (error) {
        console.error('Error getting next question:', error);
        res.status(500).json({ error: 'Failed to get next question' });
    }
});

app.delete('/api/questions/:id', async (req, res) => {
    try {
        const questionId = req.params.id;
        const questions = await readJsonFile(QUESTIONS_FILE);

        const questionIndex = questions.findIndex(q => q.id === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({ error: 'Question not found' });
        }

        questions.splice(questionIndex, 1);
        await writeJsonFile(QUESTIONS_FILE, questions);

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// AI题目生成API
app.post('/api/generate-questions', async (req, res) => {
    try {
        const { theme, count, difficulty } = req.body;

        let generatedQuestions;
        if (theme === '图片识别') {
            generatedQuestions = questionGenerator.generateImageRecognitionQuestions(count || 3);
        } else {
            generatedQuestions = questionGenerator.generateQuestionsByTheme(
                theme || '综合',
                count || 5
            );
        }

        // 检查重复题目
        const existingQuestions = await readJsonFile(QUESTIONS_FILE);
        const uniqueQuestions = [];
        let duplicateCount = 0;

        for (const newQuestion of generatedQuestions) {
            // 检查是否已存在相同标题的题目
            const isDuplicate = existingQuestions.some(existingQ => 
                existingQ.title.trim().toLowerCase() === newQuestion.title.trim().toLowerCase()
            );
            
            if (!isDuplicate) {
                uniqueQuestions.push(newQuestion);
            } else {
                duplicateCount++;
                console.log(`重复题目已跳过: ${newQuestion.title}`);
            }
        }

        // 保存不重复的题目到数据库
        const allQuestions = [...existingQuestions, ...uniqueQuestions];
        await writeJsonFile(QUESTIONS_FILE, allQuestions);

        res.json({
            success: true,
            generated: generatedQuestions.length,
            unique: uniqueQuestions.length,
            duplicates: duplicateCount,
            questions: uniqueQuestions
        });
    } catch (error) {
        console.error('Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

app.get('/api/generate-themes', (req, res) => {
    const themes = questionGenerator.getAvailableThemes();
    themes.push('图片识别'); // 添加图片识别主题
    res.json(themes);
});

app.post('/api/admin/clear-leaderboard', async (req, res) => {
    try {
        // 清空排行榜数据
        await writeJsonFile(LEADERBOARD_FILE, []);

        // 清空用户数据
        await writeJsonFile(USERS_FILE, []);

        // 清空答题记录
        await writeJsonFile(ANSWERS_FILE, []);

        // 清空内存中的用户连接
        connectedUsers.clear();

        // 广播排行榜更新
        io.emit('leaderboard-updated', []);
        io.emit('user-count-updated', 0);

        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing leaderboard:', error);
        res.status(500).json({ error: 'Failed to clear leaderboard' });
    }
});

app.get('/api/admin/status', (req, res) => {
    res.json({
        quizActive,
        currentQuestion: currentQuestion, // 管理员获取完整题目信息
        connectedUsers: connectedUsers.size
    });
});

// 启动服务器
async function startServer() {
    await initializeDataFiles();
    
    server.listen(PORT, '0.0.0.0', () => {
        const baseUrl = getAccessURL();

        console.log(`🚀 AI Quiz Server running on port ${PORT}`);
        console.log(`🌐 Access URL: ${baseUrl}`);
        console.log(`👨‍💼 Admin panel: ${baseUrl}/admin`);
        console.log(`🎯 Quiz page: ${baseUrl}/quiz`);
        console.log(`🏆 Leaderboard: ${baseUrl}/leaderboard`);
        console.log(`📋 Share this link: ${baseUrl}/quiz`);

        if (process.env.NODE_ENV === 'production') {
            console.log(`🌍 Production mode - accessible from anywhere!`);
        } else {
            console.log(`🏠 Development mode - local network only`);
        }
    });
}

startServer().catch(console.error);
