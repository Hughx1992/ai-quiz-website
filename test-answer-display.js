const http = require('http');

// 测试答案显示功能
async function testAnswerDisplay() {
    console.log('🔍 测试答案显示功能...\n');
    
    // 测试1: 检查题目数据结构
    await testQuestionStructure();
    
    // 测试2: 测试开始竞赛API
    await testStartQuizAPI();
    
    console.log('\n✅ 答案显示功能测试完成！');
}

// 测试题目数据结构
async function testQuestionStructure() {
    console.log('📋 测试题目数据结构...');
    
    try {
        const response = await makeRequest('/api/questions');
        if (response.statusCode === 200) {
            const questions = JSON.parse(response.data);
            console.log(`✅ 获取到 ${questions.length} 道题目`);
            
            if (questions.length > 0) {
                const firstQuestion = questions[0];
                console.log('📝 第一道题目信息：');
                console.log(`   题目: ${firstQuestion.title}`);
                console.log(`   选项数量: ${firstQuestion.options ? firstQuestion.options.length : 0}`);
                console.log(`   正确答案索引: ${firstQuestion.correctAnswer}`);
                console.log(`   正确答案: ${firstQuestion.options ? firstQuestion.options[firstQuestion.correctAnswer] : '未知'}`);
                console.log(`   分类: ${firstQuestion.category || '未分类'}`);
                console.log(`   难度: ${firstQuestion.difficulty || '未设置'}`);
                
                // 验证数据完整性
                if (firstQuestion.correctAnswer !== undefined && firstQuestion.options) {
                    console.log('✅ 题目数据结构完整');
                } else {
                    console.log('❌ 题目数据结构不完整');
                }
            }
        } else {
            console.log(`❌ 获取题目失败，状态码: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ 获取题目错误: ${error.message}`);
    }
    console.log('');
}

// 测试开始竞赛API
async function testStartQuizAPI() {
    console.log('🎮 测试开始竞赛API...');
    
    try {
        const response = await makeRequest('/api/admin/start-quiz', 'POST');
        if (response.statusCode === 200) {
            const data = JSON.parse(response.data);
            console.log('✅ 开始竞赛API正常');
            
            if (data.question) {
                console.log('📝 返回的题目信息：');
                console.log(`   题目: ${data.question.title}`);
                console.log(`   正确答案索引: ${data.question.correctAnswer}`);
                console.log(`   正确答案: ${data.question.options ? data.question.options[data.question.correctAnswer] : '未知'}`);
                console.log(`   分类: ${data.question.category || '未分类'}`);
                console.log(`   难度: ${data.question.difficulty || '未设置'}`);
                
                if (data.question.correctAnswer !== undefined) {
                    console.log('✅ API返回完整的题目信息（包含答案）');
                } else {
                    console.log('❌ API返回的题目信息不包含答案');
                }
            }
        } else {
            console.log(`❌ 开始竞赛API失败，状态码: ${response.statusCode}`);
        }
        
        // 停止竞赛
        await makeRequest('/api/admin/stop-quiz', 'POST');
        console.log('🛑 竞赛已停止');
        
    } catch (error) {
        console.log(`❌ 开始竞赛API错误: ${error.message}`);
    }
}

// 发送HTTP请求
function makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('请求超时'));
        });
        
        req.end();
    });
}

// 显示修复说明
function showFixExplanation() {
    console.log('🔧 答案显示修复说明:\n');
    
    console.log('❌ 问题原因:');
    console.log('   - 服务器发送给客户端的题目信息不包含correctAnswer、category、difficulty');
    console.log('   - 管理员界面无法获取完整的题目信息来显示答案\n');
    
    console.log('✅ 修复方案:');
    console.log('   1. 添加新的Socket事件 "admin-question-started"');
    console.log('   2. 向管理员发送完整的题目信息（包含答案）');
    console.log('   3. 普通用户仍然只接收不含答案的题目信息');
    console.log('   4. 管理员界面监听专用事件来显示答案\n');
    
    console.log('📝 修复内容:');
    console.log('   - 服务器端: 添加 io.emit("admin-question-started", {question: currentQuestion})');
    console.log('   - 管理员JS: 监听 "admin-question-started" 事件');
    console.log('   - 显示完整的题目信息，包括正确答案标识\n');
    
    console.log('🎯 预期效果:');
    console.log('   - 管理员界面显示正确的答案选项（A/B/C/D）');
    console.log('   - 正确答案有绿色高亮背景');
    console.log('   - 显示题目分类和难度信息');
    console.log('   - 用户端不会看到答案信息\n');
}

// 主函数
async function main() {
    console.log('🚀 AI答题竞赛网站 - 答案显示修复测试\n');
    console.log('='.repeat(60));
    
    showFixExplanation();
    
    console.log('='.repeat(60));
    await testAnswerDisplay();
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testAnswerDisplay };
