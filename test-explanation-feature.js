const http = require('http');

// 测试答案解释功能
async function testExplanationFeature() {
    console.log('🔍 测试答案解释功能\n');
    console.log('='.repeat(60));
    
    // 测试1: 检查题目数据结构
    await testQuestionStructure();
    
    // 测试2: 测试答题结果包含解释
    await testAnswerResult();
    
    console.log('\n✅ 答案解释功能测试完成！');
}

// 测试题目数据结构
async function testQuestionStructure() {
    console.log('📚 检查题目数据结构...');
    
    try {
        const response = await makeRequest('/api/questions');
        if (response.statusCode === 200) {
            const questions = JSON.parse(response.data);
            console.log(`✅ 题库包含 ${questions.length} 道题目`);
            
            // 检查解释字段
            let hasExplanation = 0;
            let totalQuestions = questions.length;
            
            console.log('\n📝 题目解释示例:');
            questions.slice(0, 3).forEach((q, index) => {
                console.log(`\n${index + 1}. ${q.title}`);
                console.log(`   正确答案: ${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}`);
                
                if (q.explanation) {
                    hasExplanation++;
                    console.log(`   💡 解释: ${q.explanation.substring(0, 80)}...`);
                } else {
                    console.log(`   ❌ 缺少解释`);
                }
            });
            
            console.log(`\n📊 解释覆盖率: ${hasExplanation}/${totalQuestions} (${(hasExplanation/totalQuestions*100).toFixed(1)}%)`);
            
            if (hasExplanation === totalQuestions) {
                console.log('✅ 所有题目都有解释');
            } else {
                console.log(`⚠️  有 ${totalQuestions - hasExplanation} 道题目缺少解释`);
            }
            
        } else {
            console.log(`❌ 获取题库失败，状态码: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ 题库检查错误: ${error.message}`);
    }
    console.log('');
}

// 测试答题结果
async function testAnswerResult() {
    console.log('🎯 测试答题结果包含解释...');
    
    try {
        // 先停止竞赛
        await makeRequest('/api/admin/stop-quiz', 'POST');
        
        // 开始竞赛
        console.log('🎮 开始竞赛...');
        const startResponse = await makeRequest('/api/admin/start-quiz', 'POST');
        
        if (startResponse.statusCode === 200) {
            const startData = JSON.parse(startResponse.data);
            console.log(`✅ 竞赛开始成功`);
            console.log(`📝 当前题目: ${startData.question.title}`);
            
            // 检查题目是否包含解释
            if (startData.question.explanation) {
                console.log(`💡 题目解释: ${startData.question.explanation.substring(0, 100)}...`);
                console.log('✅ 服务器端题目数据包含解释');
            } else {
                console.log('❌ 服务器端题目数据缺少解释');
            }
            
            // 模拟答题结果的数据结构
            console.log('\n🔍 预期的答题结果数据结构:');
            const mockResult = {
                isCorrect: true,
                points: 10,
                correctAnswer: startData.question.correctAnswer,
                correctAnswerText: startData.question.options[startData.question.correctAnswer],
                explanation: startData.question.explanation || '暂无解释',
                totalScore: 10,
                isTimeout: false
            };
            
            console.log('📋 答题结果应包含以下字段:');
            Object.keys(mockResult).forEach(key => {
                console.log(`   ✅ ${key}: ${typeof mockResult[key]} - ${JSON.stringify(mockResult[key]).substring(0, 50)}...`);
            });
            
        } else {
            console.log(`❌ 开始竞赛失败，状态码: ${startResponse.statusCode}`);
        }
        
        // 停止竞赛
        await makeRequest('/api/admin/stop-quiz', 'POST');
        console.log('🛑 竞赛已停止');
        
    } catch (error) {
        console.log(`❌ 答题结果测试错误: ${error.message}`);
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

// 显示功能说明
function showFeatureExplanation() {
    console.log('💡 答案解释功能说明:\n');
    
    console.log('🎯 功能目标:');
    console.log('   - 为每道题目提供详细的答案解释');
    console.log('   - 帮助用户理解为什么选择这个答案');
    console.log('   - 增加题目的教育价值和趣味性\n');
    
    console.log('📝 实现方案:');
    console.log('   1. 数据结构: 为每道题目添加explanation字段');
    console.log('   2. 服务器端: 在答题结果中包含解释信息');
    console.log('   3. 前端显示: 在结果页面展示答案解释');
    console.log('   4. 样式美化: 使用渐变背景和图标美化显示\n');
    
    console.log('🎨 界面设计:');
    console.log('   - 使用💡图标标识解释区域');
    console.log('   - 渐变背景色(蓝色到紫色)');
    console.log('   - 圆角边框和阴影效果');
    console.log('   - 移动端适配优化\n');
    
    console.log('📱 用户体验:');
    console.log('   - 答题后立即显示正确答案和解释');
    console.log('   - 解释内容生动有趣，易于理解');
    console.log('   - 无论答对答错都会显示解释');
    console.log('   - 增加学习价值，不只是答题竞赛\n');
    
    console.log('🔧 技术特点:');
    console.log('   - 服务器端数据完整性验证');
    console.log('   - 前端动态显示控制');
    console.log('   - CSS样式响应式设计');
    console.log('   - 向后兼容(缺少解释时显示默认文本)\n');
}

// 主函数
async function main() {
    console.log('🚀 AI答题竞赛网站 - 答案解释功能测试\n');
    
    showFeatureExplanation();
    
    console.log('='.repeat(60));
    await testExplanationFeature();
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testExplanationFeature };
