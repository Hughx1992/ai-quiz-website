const io = require('socket.io-client');

// 快速测试配置
const CONFIG = {
    SERVER_URL: 'https://web-production-a78b3.up.railway.app',
    // SERVER_URL: 'http://localhost:3000', // 本地测试时使用
    TEST_USERS: 10, // 先用10个用户测试
    TEST_QUESTIONS: 5, // 5道题快速测试
};

class QuickTest {
    constructor() {
        this.users = [];
        this.adminSocket = null;
        this.testResults = {
            connected: 0,
            failed: 0,
            answered: 0,
            errors: []
        };
    }

    async runQuickTest() {
        console.log('🚀 开始快速功能测试...\n');
        console.log(`📊 测试配置: ${CONFIG.TEST_USERS}个用户, ${CONFIG.TEST_QUESTIONS}道题\n`);

        try {
            // 1. 测试用户连接
            await this.testUserConnections();
            
            // 2. 测试管理员功能
            await this.testAdminFunctions();
            
            // 3. 测试答题流程
            await this.testQuizFlow();
            
            // 4. 生成报告
            this.generateQuickReport();
            
        } catch (error) {
            console.error('❌ 测试过程中出现错误:', error);
        } finally {
            this.cleanup();
        }
    }

    async testUserConnections() {
        console.log('🔗 测试用户连接...');
        
        const connectionPromises = [];
        
        for (let i = 1; i <= CONFIG.TEST_USERS; i++) {
            const promise = new Promise((resolve) => {
                const socket = io(CONFIG.SERVER_URL, {
                    transports: ['websocket', 'polling'],
                    timeout: 5000
                });

                const timeout = setTimeout(() => {
                    this.testResults.failed++;
                    this.testResults.errors.push(`用户${i}连接超时`);
                    socket.disconnect();
                    resolve();
                }, 5000);

                socket.on('connect', () => {
                    clearTimeout(timeout);
                    this.testResults.connected++;
                    console.log(`  ✅ 用户${i} 连接成功`);
                    
                    socket.emit('join-quiz', { nickname: `TestUser${i}` });
                    this.users.push({ id: i, socket });
                    resolve();
                });

                socket.on('connect_error', (error) => {
                    clearTimeout(timeout);
                    this.testResults.failed++;
                    this.testResults.errors.push(`用户${i}连接失败: ${error.message}`);
                    console.log(`  ❌ 用户${i} 连接失败`);
                    resolve();
                });
            });
            
            connectionPromises.push(promise);
        }

        await Promise.all(connectionPromises);
        
        console.log(`\n📊 连接结果: ${this.testResults.connected}/${CONFIG.TEST_USERS} 成功\n`);
    }

    async testAdminFunctions() {
        console.log('👨‍💼 测试管理员功能...');
        
        return new Promise((resolve) => {
            this.adminSocket = io(CONFIG.SERVER_URL);
            
            this.adminSocket.on('connect', () => {
                console.log('  ✅ 管理员连接成功');
                
                // 测试开始竞赛
                this.adminSocket.emit('start-quiz');
                console.log('  🚀 发送开始竞赛信号');
                
                setTimeout(resolve, 1000);
            });

            this.adminSocket.on('connect_error', (error) => {
                console.log('  ❌ 管理员连接失败:', error.message);
                this.testResults.errors.push(`管理员连接失败: ${error.message}`);
                resolve();
            });
        });
    }

    async testQuizFlow() {
        console.log('📝 测试答题流程...');
        
        if (!this.adminSocket) {
            console.log('  ❌ 管理员未连接，跳过答题测试');
            return;
        }

        for (let q = 1; q <= CONFIG.TEST_QUESTIONS; q++) {
            console.log(`  📋 推送第${q}题...`);
            
            const question = {
                id: q,
                question: `测试题目 ${q}: 这是一道测试题`,
                options: ['选项A', '选项B', '选项C', '选项D'],
                correctAnswer: Math.floor(Math.random() * 4),
                timeLimit: 10
            };

            // 推送题目
            this.adminSocket.emit('next-question', question);
            
            // 等待用户答题
            await this.sleep(2000);
            
            // 模拟用户提交答案
            this.users.forEach((user, index) => {
                if (user.socket && user.socket.connected) {
                    const selectedOption = Math.floor(Math.random() * 4);
                    user.socket.emit('submit-answer', { 
                        selectedOption,
                        questionId: question.id 
                    });
                    this.testResults.answered++;
                }
            });
            
            console.log(`    ✅ 第${q}题完成，${this.users.length}个用户提交答案`);
            
            // 题目间隔
            await this.sleep(1000);
        }

        // 结束竞赛
        console.log('  🏁 结束竞赛...');
        this.adminSocket.emit('end-quiz');
        await this.sleep(1000);
    }

    generateQuickReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 快速测试报告');
        console.log('='.repeat(50));
        
        const connectionRate = (this.testResults.connected / CONFIG.TEST_USERS) * 100;
        const expectedAnswers = this.testResults.connected * CONFIG.TEST_QUESTIONS;
        const answerRate = expectedAnswers > 0 ? (this.testResults.answered / expectedAnswers) * 100 : 0;
        
        console.log(`\n🔗 连接测试:`);
        console.log(`   成功连接: ${this.testResults.connected}/${CONFIG.TEST_USERS} (${connectionRate.toFixed(1)}%)`);
        console.log(`   连接失败: ${this.testResults.failed}/${CONFIG.TEST_USERS}`);
        
        console.log(`\n📝 答题测试:`);
        console.log(`   预期答题: ${expectedAnswers} 次`);
        console.log(`   实际答题: ${this.testResults.answered} 次`);
        console.log(`   答题成功率: ${answerRate.toFixed(1)}%`);
        
        console.log(`\n⚠️ 错误统计:`);
        console.log(`   错误数量: ${this.testResults.errors.length}`);
        if (this.testResults.errors.length > 0) {
            this.testResults.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
        }
        
        console.log(`\n🎯 系统评估:`);
        if (connectionRate >= 90 && answerRate >= 90) {
            console.log('   ✅ 系统运行正常，可以进行完整压力测试');
        } else if (connectionRate >= 70 && answerRate >= 70) {
            console.log('   ⚠️ 系统基本正常，但建议检查网络连接');
        } else {
            console.log('   ❌ 系统存在问题，建议先修复后再进行压力测试');
        }
        
        console.log('\n' + '='.repeat(50));
    }

    cleanup() {
        console.log('\n🧹 清理连接...');
        
        this.users.forEach(user => {
            if (user.socket) {
                user.socket.disconnect();
            }
        });
        
        if (this.adminSocket) {
            this.adminSocket.disconnect();
        }
        
        console.log('✅ 清理完成');
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 运行快速测试
if (require.main === module) {
    const quickTest = new QuickTest();
    
    process.on('SIGINT', () => {
        console.log('\n\n⏹️ 测试被中断');
        quickTest.cleanup();
        process.exit(0);
    });
    
    quickTest.runQuickTest().catch(console.error);
}

module.exports = QuickTest;
