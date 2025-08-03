const io = require('socket.io-client');
const { performance } = require('perf_hooks');

// 测试配置
const CONFIG = {
    SERVER_URL: 'https://web-production-a78b3.up.railway.app',
    // SERVER_URL: 'http://localhost:3000', // 本地测试时使用
    CONCURRENT_USERS: 100,
    TOTAL_QUESTIONS: 20,
    ANSWER_DELAY_MIN: 1000, // 最小答题时间 1秒
    ANSWER_DELAY_MAX: 5000, // 最大答题时间 5秒
    CONNECTION_DELAY: 100,  // 用户连接间隔
};

class StressTestUser {
    constructor(userId, testManager) {
        this.userId = userId;
        this.nickname = `TestUser${userId}`;
        this.testManager = testManager;
        this.socket = null;
        this.connected = false;
        this.score = 0;
        this.answeredQuestions = 0;
        this.responseTime = [];
        this.errors = [];
        this.startTime = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            try {
                this.socket = io(CONFIG.SERVER_URL, {
                    transports: ['websocket', 'polling'],
                    timeout: 10000,
                    forceNew: true
                });

                this.socket.on('connect', () => {
                    this.connected = true;
                    this.testManager.log(`✅ 用户 ${this.nickname} 连接成功`);
                    
                    // 加入竞赛
                    this.socket.emit('join-quiz', { nickname: this.nickname });
                    resolve();
                });

                this.socket.on('connect_error', (error) => {
                    this.errors.push(`连接错误: ${error.message}`);
                    this.testManager.log(`❌ 用户 ${this.nickname} 连接失败: ${error.message}`);
                    reject(error);
                });

                this.socket.on('disconnect', () => {
                    this.connected = false;
                    this.testManager.log(`🔌 用户 ${this.nickname} 断开连接`);
                });

                this.socket.on('quiz-started', () => {
                    this.startTime = performance.now();
                    this.testManager.log(`🚀 用户 ${this.nickname} 收到竞赛开始信号`);
                });

                this.socket.on('new-question', (data) => {
                    this.handleNewQuestion(data);
                });

                this.socket.on('answer-result', (data) => {
                    this.handleAnswerResult(data);
                });

                this.socket.on('quiz-ended', () => {
                    this.testManager.log(`🏁 用户 ${this.nickname} 竞赛结束，最终得分: ${this.score}`);
                    this.testManager.userFinished(this);
                });

                this.socket.on('error', (error) => {
                    this.errors.push(`Socket错误: ${error}`);
                    this.testManager.log(`⚠️ 用户 ${this.nickname} Socket错误: ${error}`);
                });

            } catch (error) {
                this.errors.push(`连接异常: ${error.message}`);
                reject(error);
            }
        });
    }

    handleNewQuestion(data) {
        const questionStartTime = performance.now();
        
        // 模拟用户思考和答题时间
        const answerDelay = Math.random() * (CONFIG.ANSWER_DELAY_MAX - CONFIG.ANSWER_DELAY_MIN) + CONFIG.ANSWER_DELAY_MIN;
        
        setTimeout(() => {
            if (this.connected && data.options && data.options.length > 0) {
                // 随机选择答案（模拟真实用户行为）
                const selectedOption = Math.floor(Math.random() * data.options.length);
                
                const responseStartTime = performance.now();
                this.socket.emit('submit-answer', { 
                    selectedOption,
                    questionId: data.id 
                });
                
                this.responseTime.push({
                    questionId: data.id,
                    thinkTime: answerDelay,
                    responseTime: performance.now() - responseStartTime
                });
                
                this.testManager.log(`📝 用户 ${this.nickname} 提交答案: 选项${selectedOption + 1} (思考时间: ${Math.round(answerDelay)}ms)`);
            }
        }, answerDelay);
    }

    handleAnswerResult(data) {
        this.answeredQuestions++;
        if (data.correct) {
            this.score += data.points || 10;
        }
        
        this.testManager.log(`📊 用户 ${this.nickname} 答题结果: ${data.correct ? '✅正确' : '❌错误'}, 当前得分: ${this.score}`);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.connected = false;
        }
    }

    getStats() {
        const avgResponseTime = this.responseTime.length > 0 
            ? this.responseTime.reduce((sum, r) => sum + r.responseTime, 0) / this.responseTime.length 
            : 0;
        
        const avgThinkTime = this.responseTime.length > 0 
            ? this.responseTime.reduce((sum, r) => sum + r.thinkTime, 0) / this.responseTime.length 
            : 0;

        return {
            userId: this.userId,
            nickname: this.nickname,
            connected: this.connected,
            score: this.score,
            answeredQuestions: this.answeredQuestions,
            avgResponseTime: Math.round(avgResponseTime),
            avgThinkTime: Math.round(avgThinkTime),
            totalErrors: this.errors.length,
            errors: this.errors
        };
    }
}

class StressTestManager {
    constructor() {
        this.users = [];
        this.startTime = null;
        this.endTime = null;
        this.stats = {
            totalUsers: CONFIG.CONCURRENT_USERS,
            connectedUsers: 0,
            disconnectedUsers: 0,
            finishedUsers: 0,
            totalErrors: 0,
            questionsAnswered: 0,
            averageScore: 0
        };
        this.logEnabled = true;
    }

    log(message) {
        if (this.logEnabled) {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[${timestamp}] ${message}`);
        }
    }

    async runStressTest() {
        console.log('🚀 开始压力测试...\n');
        console.log(`📊 测试配置:`);
        console.log(`   服务器: ${CONFIG.SERVER_URL}`);
        console.log(`   并发用户: ${CONFIG.CONCURRENT_USERS}`);
        console.log(`   题目数量: ${CONFIG.TOTAL_QUESTIONS}`);
        console.log(`   答题时间: ${CONFIG.ANSWER_DELAY_MIN}-${CONFIG.ANSWER_DELAY_MAX}ms\n`);

        this.startTime = performance.now();

        // 创建用户
        for (let i = 1; i <= CONFIG.CONCURRENT_USERS; i++) {
            this.users.push(new StressTestUser(i, this));
        }

        // 分批连接用户，避免同时连接造成服务器压力
        console.log('🔗 开始连接用户...\n');
        const connectionPromises = [];
        
        for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];
            
            // 延迟连接，模拟真实场景
            const connectPromise = new Promise(resolve => {
                setTimeout(async () => {
                    try {
                        await user.connect();
                        this.stats.connectedUsers++;
                        resolve();
                    } catch (error) {
                        this.stats.disconnectedUsers++;
                        this.stats.totalErrors++;
                        resolve();
                    }
                }, i * CONFIG.CONNECTION_DELAY);
            });
            
            connectionPromises.push(connectPromise);
        }

        // 等待所有用户连接完成
        await Promise.all(connectionPromises);
        
        console.log(`\n📈 连接统计:`);
        console.log(`   成功连接: ${this.stats.connectedUsers}/${CONFIG.CONCURRENT_USERS}`);
        console.log(`   连接失败: ${this.stats.disconnectedUsers}/${CONFIG.CONCURRENT_USERS}`);
        
        if (this.stats.connectedUsers === 0) {
            console.log('❌ 没有用户成功连接，测试终止');
            return;
        }

        // 等待一段时间让连接稳定
        console.log('\n⏳ 等待连接稳定...');
        await this.sleep(3000);

        // 开始模拟管理员操作
        console.log('\n🎮 模拟管理员开始竞赛...');
        await this.simulateAdminActions();

        // 等待测试完成
        console.log('\n⏳ 等待测试完成...');
        await this.waitForTestCompletion();

        // 生成测试报告
        this.generateReport();
    }

    async simulateAdminActions() {
        // 模拟管理员连接
        const adminSocket = io(CONFIG.SERVER_URL);
        
        return new Promise((resolve) => {
            adminSocket.on('connect', () => {
                console.log('👨‍💼 管理员连接成功');
                
                // 开始竞赛
                setTimeout(() => {
                    adminSocket.emit('start-quiz');
                    console.log('🚀 竞赛已开始');
                }, 1000);

                // 模拟推送题目
                let questionCount = 0;
                const questionInterval = setInterval(() => {
                    if (questionCount >= CONFIG.TOTAL_QUESTIONS) {
                        clearInterval(questionInterval);
                        
                        // 结束竞赛
                        setTimeout(() => {
                            adminSocket.emit('end-quiz');
                            console.log('🏁 竞赛已结束');
                            adminSocket.disconnect();
                            resolve();
                        }, 2000);
                        return;
                    }

                    questionCount++;
                    const question = {
                        id: questionCount,
                        question: `测试题目 ${questionCount}`,
                        options: ['选项A', '选项B', '选项C', '选项D'],
                        correctAnswer: Math.floor(Math.random() * 4),
                        timeLimit: 30
                    };

                    adminSocket.emit('next-question', question);
                    console.log(`📝 推送第 ${questionCount} 题`);
                }, 8000); // 每8秒一题
            });
        });
    }

    async waitForTestCompletion() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const activeUsers = this.users.filter(u => u.connected).length;
                
                if (activeUsers === 0 || this.stats.finishedUsers >= this.stats.connectedUsers) {
                    clearInterval(checkInterval);
                    this.endTime = performance.now();
                    resolve();
                }
            }, 1000);

            // 最大等待时间 5 分钟
            setTimeout(() => {
                clearInterval(checkInterval);
                this.endTime = performance.now();
                resolve();
            }, 300000);
        });
    }

    userFinished(user) {
        this.stats.finishedUsers++;
        this.stats.questionsAnswered += user.answeredQuestions;
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 压力测试报告');
        console.log('='.repeat(60));

        const testDuration = (this.endTime - this.startTime) / 1000;
        const userStats = this.users.map(u => u.getStats());
        
        // 基础统计
        const connectedUsers = userStats.filter(u => u.connected).length;
        const totalScore = userStats.reduce((sum, u) => sum + u.score, 0);
        const totalAnswered = userStats.reduce((sum, u) => sum + u.answeredQuestions, 0);
        const totalErrors = userStats.reduce((sum, u) => sum + u.totalErrors, 0);
        
        console.log(`\n🕒 测试时长: ${testDuration.toFixed(2)} 秒`);
        console.log(`\n👥 用户统计:`);
        console.log(`   目标用户数: ${CONFIG.CONCURRENT_USERS}`);
        console.log(`   成功连接: ${this.stats.connectedUsers} (${(this.stats.connectedUsers/CONFIG.CONCURRENT_USERS*100).toFixed(1)}%)`);
        console.log(`   当前在线: ${connectedUsers}`);
        console.log(`   完成测试: ${this.stats.finishedUsers}`);
        
        console.log(`\n📝 答题统计:`);
        console.log(`   总答题数: ${totalAnswered}`);
        console.log(`   平均每人答题: ${(totalAnswered/this.stats.connectedUsers).toFixed(1)} 题`);
        console.log(`   总得分: ${totalScore}`);
        console.log(`   平均得分: ${(totalScore/this.stats.connectedUsers).toFixed(1)} 分`);
        
        console.log(`\n⚠️ 错误统计:`);
        console.log(`   总错误数: ${totalErrors}`);
        console.log(`   错误率: ${(totalErrors/(this.stats.connectedUsers)*100).toFixed(2)}%`);
        
        // 性能统计
        const responseTimeStats = userStats
            .filter(u => u.avgResponseTime > 0)
            .map(u => u.avgResponseTime);
        
        if (responseTimeStats.length > 0) {
            const avgResponseTime = responseTimeStats.reduce((sum, t) => sum + t, 0) / responseTimeStats.length;
            const maxResponseTime = Math.max(...responseTimeStats);
            const minResponseTime = Math.min(...responseTimeStats);
            
            console.log(`\n⚡ 性能统计:`);
            console.log(`   平均响应时间: ${avgResponseTime.toFixed(2)} ms`);
            console.log(`   最大响应时间: ${maxResponseTime} ms`);
            console.log(`   最小响应时间: ${minResponseTime} ms`);
        }
        
        // 系统稳定性评估
        console.log(`\n🎯 系统稳定性评估:`);
        const connectionSuccessRate = (this.stats.connectedUsers / CONFIG.CONCURRENT_USERS) * 100;
        const completionRate = (this.stats.finishedUsers / this.stats.connectedUsers) * 100;
        const errorRate = (totalErrors / this.stats.connectedUsers) * 100;
        
        console.log(`   连接成功率: ${connectionSuccessRate.toFixed(1)}% ${this.getGrade(connectionSuccessRate)}`);
        console.log(`   测试完成率: ${completionRate.toFixed(1)}% ${this.getGrade(completionRate)}`);
        console.log(`   系统错误率: ${errorRate.toFixed(2)}% ${this.getGrade(100-errorRate)}`);
        
        // 总体评级
        const overallScore = (connectionSuccessRate + completionRate + (100-errorRate)) / 3;
        console.log(`\n🏆 总体评级: ${overallScore.toFixed(1)}% ${this.getGrade(overallScore)}`);
        
        if (overallScore >= 90) {
            console.log('✅ 系统表现优秀，可以支持100人同时在线答题！');
        } else if (overallScore >= 80) {
            console.log('⚠️ 系统表现良好，但建议进行优化以提高稳定性。');
        } else {
            console.log('❌ 系统需要优化才能稳定支持100人同时在线。');
        }
        
        console.log('\n' + '='.repeat(60));
        
        // 断开所有连接
        this.users.forEach(user => user.disconnect());
    }

    getGrade(score) {
        if (score >= 95) return '🟢 优秀';
        if (score >= 85) return '🟡 良好';
        if (score >= 70) return '🟠 一般';
        return '🔴 需改进';
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 运行压力测试
if (require.main === module) {
    const testManager = new StressTestManager();
    
    process.on('SIGINT', () => {
        console.log('\n\n⏹️ 测试被中断');
        testManager.users.forEach(user => user.disconnect());
        process.exit(0);
    });
    
    testManager.runStressTest().catch(console.error);
}

module.exports = { StressTestManager, StressTestUser };
