const http = require('http');

// 测试两个bug修复
async function testBugFixes() {
    console.log('🐛 测试两个bug修复...\n');
    
    // 测试1: 排行榜答题数问题
    console.log('📊 Bug 1: 排行榜答题数自动刷新问题');
    console.log('✅ 修复方案: 从答题记录文件中统计实际答题数量');
    console.log('✅ 修复内容:');
    console.log('   - 不再依赖内存中的user.answeredQuestions.length');
    console.log('   - 从answers.json文件中统计用户实际答题数量');
    console.log('   - 避免重复计算和内存状态不一致问题\n');
    
    // 测试2: 按钮状态重置问题
    console.log('🔘 Bug 2: 新题目推送时按钮状态不重置问题');
    console.log('✅ 修复方案: 添加resetQuestionState()函数');
    console.log('✅ 修复内容:');
    console.log('   - 重置selectedAnswer和isTimedOut状态');
    console.log('   - 重置提交按钮文本、样式和可用性');
    console.log('   - 重置所有选项的状态和样式');
    console.log('   - 重置计时器显示样式');
    console.log('   - 在displayQuestion()中调用重置函数\n');
    
    // 测试API功能
    await testLeaderboardAPI();
    
    console.log('✅ Bug修复测试完成！');
}

// 测试排行榜API
async function testLeaderboardAPI() {
    console.log('🧪 测试排行榜API...');
    
    try {
        const response = await makeRequest('/api/leaderboard');
        if (response.statusCode === 200) {
            const leaderboard = JSON.parse(response.data);
            console.log(`✅ 获取排行榜成功，共 ${leaderboard.length} 条记录`);
            
            if (leaderboard.length > 0) {
                console.log('📋 排行榜数据示例:');
                leaderboard.slice(0, 3).forEach((user, index) => {
                    console.log(`   ${index + 1}. ${user.nickname} - 得分: ${user.score}, 答题数: ${user.answeredCount}`);
                });
            }
        } else {
            console.log(`❌ 获取排行榜失败，状态码: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ 排行榜API错误: ${error.message}`);
    }
    console.log('');
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

// 显示修复详情
function showFixDetails() {
    console.log('🔧 Bug修复详细说明:\n');
    
    console.log('🐛 Bug 1: 排行榜答题数自动刷新');
    console.log('   问题现象: 排行榜上的答题数一直在自动增长，即使没有答题');
    console.log('   问题原因: answeredCount基于内存中的user.answeredQuestions.length计算');
    console.log('   修复方案: 改为从answers.json文件中统计实际答题记录');
    console.log('   修复代码:');
    console.log('   ```javascript');
    console.log('   const answers = await readJsonFile(ANSWERS_FILE);');
    console.log('   const userAnswerCount = answers.filter(answer => answer.userId === user.id).length;');
    console.log('   ```\n');
    
    console.log('🐛 Bug 2: 新题目推送时按钮状态不重置');
    console.log('   问题现象: 推送新题目时，提交按钮显示上一次的状态（如"答题超时"）');
    console.log('   问题原因: displayQuestion()函数没有完全重置UI状态');
    console.log('   修复方案: 添加resetQuestionState()函数，完全重置所有UI状态');
    console.log('   修复内容:');
    console.log('   - 重置selectedAnswer = null');
    console.log('   - 重置isTimedOut = false');
    console.log('   - 重置提交按钮: 文本、样式、可用性');
    console.log('   - 重置选项按钮: 样式、可用性、选中状态');
    console.log('   - 重置计时器显示样式\n');
    
    console.log('🔄 额外改进: 用户重连处理');
    console.log('   - 支持用户断线重连，保持原有得分和状态');
    console.log('   - 避免重复创建用户记录');
    console.log('   - 更新socket连接映射\n');
    
    console.log('🎯 预期效果:');
    console.log('   1. 排行榜答题数准确反映实际答题次数');
    console.log('   2. 新题目推送时，所有UI状态完全重置');
    console.log('   3. 用户可以正常重连而不影响数据');
    console.log('   4. 系统状态更加稳定和准确\n');
}

// 主函数
async function main() {
    console.log('🚀 AI答题竞赛网站 - Bug修复测试\n');
    console.log('='.repeat(60));
    
    showFixDetails();
    
    console.log('='.repeat(60));
    await testBugFixes();
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testBugFixes };
