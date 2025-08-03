const https = require('https');

const RAILWAY_URL = 'https://web-production-a78b3.up.railway.app';

console.log('🚀 验证Railway部署状态...\n');

function checkEndpoint(url, description) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        https.get(url, (res) => {
            const responseTime = Date.now() - startTime;
            
            if (res.statusCode === 200) {
                console.log(`✅ ${description}: 正常 (${res.statusCode}) - ${responseTime}ms`);
                resolve(true);
            } else {
                console.log(`⚠️  ${description}: 状态码 ${res.statusCode} - ${responseTime}ms`);
                resolve(false);
            }
        }).on('error', (err) => {
            const responseTime = Date.now() - startTime;
            console.log(`❌ ${description}: 错误 - ${err.message} - ${responseTime}ms`);
            resolve(false);
        });
    });
}

async function verifyDeployment() {
    console.log(`🌐 检查Railway部署: ${RAILWAY_URL}\n`);
    
    const endpoints = [
        { url: RAILWAY_URL, desc: '主页' },
        { url: `${RAILWAY_URL}/quiz`, desc: '答题页面' },
        { url: `${RAILWAY_URL}/leaderboard`, desc: '排行榜页面' },
        { url: `${RAILWAY_URL}/admin`, desc: '管理员面板' },
        { url: `${RAILWAY_URL}/cyber-admin-demo.html`, desc: '权限演示页面' }
    ];
    
    let successCount = 0;
    
    for (const endpoint of endpoints) {
        const success = await checkEndpoint(endpoint.url, endpoint.desc);
        if (success) successCount++;
        
        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`\n📊 部署验证结果:`);
    console.log(`✅ 成功: ${successCount}/${endpoints.length}`);
    console.log(`❌ 失败: ${endpoints.length - successCount}/${endpoints.length}`);
    
    if (successCount === endpoints.length) {
        console.log('\n🎉 所有页面都已成功部署到Railway！');
        console.log(`\n🌐 访问地址:`);
        console.log(`   主页: ${RAILWAY_URL}`);
        console.log(`   答题: ${RAILWAY_URL}/quiz`);
        console.log(`   排行榜: ${RAILWAY_URL}/leaderboard`);
        console.log(`   管理面板: ${RAILWAY_URL}/admin`);
        console.log(`   权限演示: ${RAILWAY_URL}/cyber-admin-demo.html`);
    } else {
        console.log('\n⚠️  部分页面可能还在部署中，请稍后再试。');
    }
    
    console.log(`\n🔗 Railway项目仪表板: https://railway.com/project/1a2e4292-1051-4c28-baf8-433e14f7bea8`);
}

verifyDeployment().catch(console.error);
