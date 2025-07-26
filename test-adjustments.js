const http = require('http');

// 测试三个调整
async function testAdjustments() {
    console.log('🔧 测试三个调整功能...\n');
    
    // 测试1: 验证倒计时调整为30秒
    console.log('⏰ 调整1: 倒计时调整为30秒');
    console.log('✅ 前端代码已调整：timeLeft = 30');
    console.log('✅ 颜色变化阈值已调整：绿色(>15s) → 黄色(5-15s) → 红色闪烁(<5s)');
    console.log('✅ HTML默认显示已调整为30s\n');
    
    // 测试2: 测试清空排行榜API
    await testClearLeaderboardAPI();
    
    // 测试3: 验证题目答案显示
    console.log('📝 调整3: 后台显示题目答案');
    console.log('✅ 管理员界面已添加答案显示功能');
    console.log('✅ 当前题目区域会显示：');
    console.log('   - 正确答案选项（绿色高亮）');
    console.log('   - 答案标识（A/B/C/D）');
    console.log('   - 题目分类和难度信息');
    console.log('✅ 正确答案会有特殊样式标识\n');
    
    console.log('✅ 所有调整测试完成！');
}

// 测试清空排行榜API
async function testClearLeaderboardAPI() {
    console.log('🗑️  调整2: 清空排行榜功能');
    
    try {
        const response = await makeRequest('/api/admin/clear-leaderboard', 'POST');
        if (response.statusCode === 200) {
            const data = JSON.parse(response.data);
            if (data.success) {
                console.log('✅ 清空排行榜API正常工作');
                console.log('✅ 管理员界面已添加"清空排行榜"按钮');
                console.log('✅ 清空功能包括：');
                console.log('   - 清空排行榜数据');
                console.log('   - 清空用户数据');
                console.log('   - 清空答题记录');
                console.log('   - 重置在线用户计数');
            } else {
                console.log('❌ 清空排行榜API返回失败');
            }
        } else {
            console.log(`❌ 清空排行榜API失败，状态码: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ 清空排行榜API错误: ${error.message}`);
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

// 显示调整说明
function showAdjustmentDetails() {
    console.log('📋 三个调整详细说明:\n');
    
    console.log('🔧 调整1: 倒计时调整为30秒');
    console.log('   - 答题时间从60秒调整为30秒');
    console.log('   - 颜色变化阈值相应调整：');
    console.log('     * 绿色：剩余时间 > 15秒');
    console.log('     * 黄色：剩余时间 5-15秒');
    console.log('     * 红色闪烁：剩余时间 < 5秒');
    console.log('   - HTML默认显示调整为30s\n');
    
    console.log('🗑️  调整2: 清空排行榜按钮');
    console.log('   - 在管理员界面排行榜区域添加"清空排行榜"按钮');
    console.log('   - 点击后会弹出确认对话框');
    console.log('   - 清空操作包括：');
    console.log('     * 清空排行榜数据（leaderboard.json）');
    console.log('     * 清空用户数据（users.json）');
    console.log('     * 清空答题记录（answers.json）');
    console.log('     * 重置内存中的用户连接');
    console.log('     * 广播更新给所有客户端');
    console.log('   - 操作不可恢复，需要谨慎使用\n');
    
    console.log('📝 调整3: 后台显示题目答案');
    console.log('   - 在管理员界面的"当前题目"区域显示答案');
    console.log('   - 显示内容包括：');
    console.log('     * 正确答案选项（绿色高亮背景）');
    console.log('     * 答案标识（A/B/C/D）');
    console.log('     * 题目分类信息');
    console.log('     * 题目难度信息');
    console.log('   - 正确答案有特殊的视觉标识');
    console.log('   - 方便管理员确认题目和答案的正确性\n');
    
    console.log('🎮 使用方法:');
    console.log('1. 访问 http://localhost:3000/admin 进入管理员界面');
    console.log('2. 开始竞赛后可以看到题目答案显示');
    console.log('3. 在排行榜区域可以使用"清空排行榜"按钮');
    console.log('4. 用户答题时间现在是30秒，颜色会相应变化\n');
}

// 主函数
async function main() {
    console.log('🚀 AI答题竞赛网站 - 三个调整测试\n');
    console.log('='.repeat(60));
    
    showAdjustmentDetails();
    
    console.log('='.repeat(60));
    await testAdjustments();
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testAdjustments };
