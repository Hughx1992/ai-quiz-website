const http = require('http');
const fs = require('fs');
const path = require('path');

// 测试配置
const BASE_URL = 'http://localhost:3000';
const TEST_RESULTS = [];

// 测试函数
async function runTests() {
    console.log('🚀 开始系统测试...\n');
    
    // 测试1: 服务器连接
    await testServerConnection();
    
    // 测试2: 静态文件访问
    await testStaticFiles();
    
    // 测试3: API端点测试
    await testAPIEndpoints();
    
    // 测试4: 数据文件检查
    await testDataFiles();
    
    // 输出测试结果
    printTestResults();
}

// 测试服务器连接
async function testServerConnection() {
    console.log('📡 测试服务器连接...');
    
    try {
        const response = await makeRequest('/');
        if (response.statusCode === 200) {
            addTestResult('服务器连接', '✅ 通过', '服务器正常响应');
        } else {
            addTestResult('服务器连接', '❌ 失败', `状态码: ${response.statusCode}`);
        }
    } catch (error) {
        addTestResult('服务器连接', '❌ 失败', error.message);
    }
}

// 测试静态文件访问
async function testStaticFiles() {
    console.log('📁 测试静态文件访问...');
    
    const staticFiles = [
        '/css/style.css',
        '/css/quiz.css', 
        '/css/admin.css',
        '/css/leaderboard.css',
        '/js/main.js',
        '/js/quiz.js',
        '/js/admin.js',
        '/js/leaderboard.js'
    ];
    
    for (const file of staticFiles) {
        try {
            const response = await makeRequest(file);
            if (response.statusCode === 200) {
                addTestResult(`静态文件 ${file}`, '✅ 通过', '文件可正常访问');
            } else {
                addTestResult(`静态文件 ${file}`, '❌ 失败', `状态码: ${response.statusCode}`);
            }
        } catch (error) {
            addTestResult(`静态文件 ${file}`, '❌ 失败', error.message);
        }
    }
}

// 测试API端点
async function testAPIEndpoints() {
    console.log('🔌 测试API端点...');
    
    const apiTests = [
        { path: '/api/qrcode', method: 'GET', name: '二维码生成API' },
        { path: '/api/questions', method: 'GET', name: '题目列表API' },
        { path: '/api/leaderboard', method: 'GET', name: '排行榜API' },
        { path: '/api/admin/status', method: 'GET', name: '管理员状态API' },
        { path: '/api/generate-themes', method: 'GET', name: '生成主题API' }
    ];
    
    for (const test of apiTests) {
        try {
            const response = await makeRequest(test.path);
            if (response.statusCode === 200) {
                const data = JSON.parse(response.data);
                addTestResult(test.name, '✅ 通过', `返回数据: ${typeof data}`);
            } else {
                addTestResult(test.name, '❌ 失败', `状态码: ${response.statusCode}`);
            }
        } catch (error) {
            addTestResult(test.name, '❌ 失败', error.message);
        }
    }
}

// 测试数据文件
async function testDataFiles() {
    console.log('💾 测试数据文件...');
    
    const dataFiles = [
        'database/users.json',
        'database/questions.json', 
        'database/answers.json',
        'database/leaderboard.json'
    ];
    
    for (const file of dataFiles) {
        const filePath = path.join(__dirname, file);
        try {
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                addTestResult(`数据文件 ${file}`, '✅ 通过', `包含 ${Array.isArray(data) ? data.length : Object.keys(data).length} 条记录`);
            } else {
                addTestResult(`数据文件 ${file}`, '❌ 失败', '文件不存在');
            }
        } catch (error) {
            addTestResult(`数据文件 ${file}`, '❌ 失败', error.message);
        }
    }
}

// 发送HTTP请求
function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
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

// 添加测试结果
function addTestResult(testName, status, details) {
    TEST_RESULTS.push({
        name: testName,
        status: status,
        details: details
    });
}

// 打印测试结果
function printTestResults() {
    console.log('\n📊 测试结果汇总:');
    console.log('='.repeat(80));
    
    let passCount = 0;
    let failCount = 0;
    
    TEST_RESULTS.forEach((result, index) => {
        console.log(`${index + 1}. ${result.name}`);
        console.log(`   状态: ${result.status}`);
        console.log(`   详情: ${result.details}`);
        console.log('');
        
        if (result.status.includes('✅')) {
            passCount++;
        } else {
            failCount++;
        }
    });
    
    console.log('='.repeat(80));
    console.log(`总计: ${TEST_RESULTS.length} 项测试`);
    console.log(`通过: ${passCount} 项 ✅`);
    console.log(`失败: ${failCount} 项 ❌`);
    console.log(`成功率: ${((passCount / TEST_RESULTS.length) * 100).toFixed(1)}%`);
    
    if (failCount === 0) {
        console.log('\n🎉 所有测试通过！系统运行正常。');
    } else {
        console.log('\n⚠️  部分测试失败，请检查相关功能。');
    }
}

// 性能测试
async function performanceTest() {
    console.log('\n⚡ 开始性能测试...');
    
    const testCount = 10;
    const times = [];
    
    for (let i = 0; i < testCount; i++) {
        const start = Date.now();
        try {
            await makeRequest('/api/questions');
            const end = Date.now();
            times.push(end - start);
        } catch (error) {
            console.log(`请求 ${i + 1} 失败:`, error.message);
        }
    }
    
    if (times.length > 0) {
        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        
        console.log(`平均响应时间: ${avgTime.toFixed(2)}ms`);
        console.log(`最快响应时间: ${minTime}ms`);
        console.log(`最慢响应时间: ${maxTime}ms`);
        
        if (avgTime < 100) {
            console.log('✅ 性能优秀');
        } else if (avgTime < 500) {
            console.log('✅ 性能良好');
        } else {
            console.log('⚠️  性能需要优化');
        }
    }
}

// 主函数
async function main() {
    try {
        await runTests();
        await performanceTest();
    } catch (error) {
        console.error('测试过程中发生错误:', error);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = { runTests, performanceTest };
