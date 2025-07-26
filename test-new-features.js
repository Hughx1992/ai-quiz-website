const http = require('http');

// 测试新功能
async function testNewFeatures() {
    console.log('🧪 测试新增功能...\n');
    
    // 测试1: 检查二维码API是否返回正确的IP地址
    await testQRCodeAPI();
    
    // 测试2: 检查下一题API
    await testNextQuestionAPI();
    
    console.log('\n✅ 新功能测试完成！');
}

// 测试二维码API
async function testQRCodeAPI() {
    console.log('📱 测试二维码API...');
    
    try {
        const response = await makeRequest('/api/qrcode');
        if (response.statusCode === 200) {
            const data = JSON.parse(response.data);
            console.log(`✅ 二维码API正常`);
            console.log(`📍 生成的URL: ${data.url}`);
            
            // 检查URL是否包含IP地址而不是localhost
            if (data.url.includes('localhost')) {
                console.log('⚠️  警告: URL仍然使用localhost，手机可能无法访问');
            } else {
                console.log('✅ URL使用IP地址，手机可以访问');
            }
        } else {
            console.log(`❌ 二维码API失败，状态码: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ 二维码API错误: ${error.message}`);
    }
}

// 测试下一题API
async function testNextQuestionAPI() {
    console.log('📝 测试下一题API...');
    
    try {
        // 先尝试在未开始竞赛时调用下一题API
        const response1 = await makeRequest('/api/admin/next-question', 'POST');
        if (response1.statusCode === 400) {
            console.log('✅ 未开始竞赛时正确返回错误');
        }
        
        // 测试开始竞赛API
        const response2 = await makeRequest('/api/admin/start-quiz', 'POST');
        if (response2.statusCode === 200) {
            console.log('✅ 开始竞赛API正常');
            
            // 等待1秒后测试下一题API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const response3 = await makeRequest('/api/admin/next-question', 'POST');
            if (response3.statusCode === 200) {
                const data = JSON.parse(response3.data);
                console.log('✅ 下一题API正常');
                console.log(`📋 题目: ${data.question.title.substring(0, 30)}...`);
            } else {
                console.log(`❌ 下一题API失败，状态码: ${response3.statusCode}`);
            }
        } else {
            console.log(`❌ 开始竞赛API失败，状态码: ${response2.statusCode}`);
        }
        
        // 停止竞赛
        await makeRequest('/api/admin/stop-quiz', 'POST');
        console.log('🛑 竞赛已停止');
        
    } catch (error) {
        console.log(`❌ 下一题API错误: ${error.message}`);
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

// 显示使用说明
function showInstructions() {
    console.log('📋 新功能使用说明:\n');
    
    console.log('🔧 问题修复:');
    console.log('1. ✅ 二维码现在使用本机IP地址，手机可以扫码访问');
    console.log('2. ✅ 管理员可以使用"下一题"按钮切换题目\n');
    
    console.log('⏰ 新增功能:');
    console.log('1. ✅ 答题倒计时从30秒增加到60秒');
    console.log('2. ✅ 超时后自动锁定，无法继续答题');
    console.log('3. ✅ 倒计时颜色变化：绿色(>30s) → 黄色(10-30s) → 红色闪烁(<10s)');
    console.log('4. ✅ 超时状态在结果页面有专门显示\n');
    
    console.log('🎮 使用方法:');
    console.log('1. 访问 http://localhost:3000 查看二维码');
    console.log('2. 手机扫码或直接访问显示的IP地址');
    console.log('3. 管理员在 http://localhost:3000/admin 控制竞赛');
    console.log('4. 使用"开始竞赛"和"下一题"按钮控制题目');
    console.log('5. 用户有60秒时间答题，超时自动锁定\n');
}

// 主函数
async function main() {
    console.log('🚀 AI答题竞赛网站 - 新功能测试\n');
    console.log('='.repeat(50));
    
    showInstructions();
    
    console.log('='.repeat(50));
    await testNewFeatures();
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testNewFeatures };
