const http = require('http');

// 测试管理员答案解释功能
async function testAdminExplanation() {
    console.log('🔍 测试管理员答案解释功能\n');
    console.log('='.repeat(60));
    
    // 测试1: 验证用户界面不包含解释
    await testUserInterface();
    
    // 测试2: 验证管理员界面包含解释
    await testAdminInterface();
    
    console.log('\n✅ 管理员答案解释功能测试完成！');
}

// 测试用户界面
async function testUserInterface() {
    console.log('👤 测试用户界面（不应包含解释）...');
    
    try {
        // 开始竞赛
        const startResponse = await makeRequest('/api/admin/start-quiz', 'POST');
        
        if (startResponse.statusCode === 200) {
            const startData = JSON.parse(startResponse.data);
            console.log(`✅ 竞赛开始成功`);
            console.log(`📝 当前题目: ${startData.question.title}`);
            
            // 检查用户端接收的数据结构
            console.log('\n📋 用户端接收的题目数据:');
            const userQuestionData = {
                id: startData.question.id,
                title: startData.question.title,
                options: startData.question.options,
                image: startData.question.image
            };
            
            Object.keys(userQuestionData).forEach(key => {
                console.log(`   ✅ ${key}: ${typeof userQuestionData[key]}`);
            });
            
            // 验证用户端不包含敏感信息
            if (!startData.question.hasOwnProperty('correctAnswer')) {
                console.log('✅ 用户端数据不包含正确答案');
            } else {
                console.log('❌ 用户端数据包含正确答案（安全问题）');
            }
            
            if (!startData.question.hasOwnProperty('explanation')) {
                console.log('✅ 用户端数据不包含答案解释');
            } else {
                console.log('❌ 用户端数据包含答案解释（不符合要求）');
            }
            
        } else {
            console.log(`❌ 开始竞赛失败，状态码: ${startResponse.statusCode}`);
        }
        
    } catch (error) {
        console.log(`❌ 用户界面测试错误: ${error.message}`);
    }
    console.log('');
}

// 测试管理员界面
async function testAdminInterface() {
    console.log('👨‍💼 测试管理员界面（应包含解释）...');
    
    try {
        // 获取管理员状态
        const statusResponse = await makeRequest('/api/admin/status');
        
        if (statusResponse.statusCode === 200) {
            const statusData = JSON.parse(statusResponse.data);
            console.log(`✅ 获取管理员状态成功`);
            
            if (statusData.currentQuestion) {
                console.log(`📝 当前题目: ${statusData.currentQuestion.title}`);
                
                // 检查管理员端的完整数据
                console.log('\n📋 管理员端题目数据结构:');
                const adminQuestionFields = [
                    'id', 'title', 'options', 'correctAnswer', 
                    'category', 'difficulty', 'explanation'
                ];
                
                adminQuestionFields.forEach(field => {
                    if (statusData.currentQuestion.hasOwnProperty(field)) {
                        console.log(`   ✅ ${field}: ${typeof statusData.currentQuestion[field]}`);
                    } else {
                        console.log(`   ❌ 缺少字段: ${field}`);
                    }
                });
                
                // 验证解释内容
                if (statusData.currentQuestion.explanation) {
                    console.log(`\n💡 答案解释预览:`);
                    console.log(`   "${statusData.currentQuestion.explanation.substring(0, 100)}..."`);
                    console.log('✅ 管理员可以看到答案解释');
                } else {
                    console.log('❌ 管理员看不到答案解释');
                }
                
                // 验证正确答案
                if (statusData.currentQuestion.correctAnswer !== undefined) {
                    const correctLetter = String.fromCharCode(65 + statusData.currentQuestion.correctAnswer);
                    const correctText = statusData.currentQuestion.options[statusData.currentQuestion.correctAnswer];
                    console.log(`✅ 正确答案: ${correctLetter}. ${correctText}`);
                } else {
                    console.log('❌ 管理员看不到正确答案');
                }
                
            } else {
                console.log('ℹ️  当前没有进行中的题目');
            }
            
        } else {
            console.log(`❌ 获取管理员状态失败，状态码: ${statusResponse.statusCode}`);
        }
        
        // 停止竞赛
        await makeRequest('/api/admin/stop-quiz', 'POST');
        console.log('🛑 竞赛已停止');
        
    } catch (error) {
        console.log(`❌ 管理员界面测试错误: ${error.message}`);
    }
}

// HTTP请求函数
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
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        });
        
        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('请求超时'));
        });
        
        req.end();
    });
}

// 显示修改说明
function showModificationExplanation() {
    console.log('🔧 答案解释位置修改说明:\n');
    
    console.log('📋 修改要求:');
    console.log('   - 答案解释只在管理员控制面板显示');
    console.log('   - 用户答题界面不显示解释');
    console.log('   - 保持用户界面简洁，避免泄露答案\n');
    
    console.log('✅ 实现方案:');
    console.log('   1. 移除用户答题界面的解释显示代码');
    console.log('   2. 在管理员界面添加解释显示区域');
    console.log('   3. 修改displayCurrentQuestion函数显示解释');
    console.log('   4. 添加专门的管理员解释样式\n');
    
    console.log('🎨 界面设计:');
    console.log('   - 管理员界面: 绿色渐变背景，突出显示');
    console.log('   - 用户界面: 保持原有简洁设计');
    console.log('   - 解释区域: 位于当前题目下方\n');
    
    console.log('🔒 安全考虑:');
    console.log('   - 用户端不接收答案和解释信息');
    console.log('   - 管理员端接收完整题目数据');
    console.log('   - 防止用户通过前端获取答案\n');
    
    console.log('📱 用户体验:');
    console.log('   - 用户: 专注答题，界面简洁');
    console.log('   - 管理员: 完整信息，便于管理');
    console.log('   - 分离关注点，各司其职\n');
}

// 主函数
async function main() {
    console.log('🚀 AI答题竞赛网站 - 管理员答案解释功能测试\n');
    
    showModificationExplanation();
    
    console.log('='.repeat(60));
    await testAdminExplanation();
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testAdminExplanation };
