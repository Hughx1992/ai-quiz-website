const os = require('os');
const http = require('http');

// 网络诊断脚本
async function diagnoseNetwork() {
    console.log('🔍 AI答题网站网络诊断\n');
    console.log('='.repeat(60));
    
    // 1. 检查网络接口
    checkNetworkInterfaces();
    
    // 2. 检查服务器状态
    await checkServerStatus();
    
    // 3. 提供解决方案
    provideSolutions();
}

// 检查网络接口
function checkNetworkInterfaces() {
    console.log('🌐 检查网络接口:\n');
    
    const interfaces = os.networkInterfaces();
    let localIP = null;
    let wifiIP = null;
    
    Object.keys(interfaces).forEach(name => {
        const iface = interfaces[name];
        iface.forEach(details => {
            if (details.family === 'IPv4' && !details.internal) {
                console.log(`📡 ${name}: ${details.address}`);
                
                if (name.toLowerCase().includes('wi-fi') || 
                    name.toLowerCase().includes('wlan') ||
                    name.toLowerCase().includes('wireless')) {
                    wifiIP = details.address;
                } else if (name.toLowerCase().includes('ethernet') ||
                          name.toLowerCase().includes('en0') ||
                          name.toLowerCase().includes('eth')) {
                    localIP = details.address;
                }
                
                if (!localIP && !wifiIP) {
                    localIP = details.address; // 备用IP
                }
            }
        });
    });
    
    const targetIP = wifiIP || localIP;
    
    if (targetIP) {
        console.log(`\n✅ 建议使用的IP地址: ${targetIP}`);
        console.log(`📱 移动端访问链接: http://${targetIP}:3000/quiz`);
        console.log(`👨‍💼 管理员链接: http://${targetIP}:3000/admin`);
    } else {
        console.log('\n❌ 未找到可用的网络接口');
    }
    
    console.log('\n' + '='.repeat(60));
}

// 检查服务器状态
async function checkServerStatus() {
    console.log('🖥️  检查服务器状态:\n');
    
    try {
        const response = await makeRequest('localhost', 3000, '/');
        if (response.statusCode === 200) {
            console.log('✅ 本地服务器运行正常 (localhost:3000)');
        } else {
            console.log(`⚠️  本地服务器响应异常 (状态码: ${response.statusCode})`);
        }
    } catch (error) {
        console.log('❌ 本地服务器无法访问');
        console.log(`   错误: ${error.message}`);
        console.log('   请确保服务器正在运行: npm start');
    }
    
    console.log('\n' + '='.repeat(60));
}

// HTTP请求函数
function makeRequest(hostname, port, path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: hostname,
            port: port,
            path: path,
            method: 'GET',
            timeout: 3000
        };
        
        const req = http.request(options, (res) => {
            resolve({ statusCode: res.statusCode });
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('请求超时'));
        });
        
        req.end();
    });
}

// 提供解决方案
function provideSolutions() {
    console.log('💡 解决方案:\n');
    
    console.log('🔧 方案1: 修改服务器监听地址 (推荐)');
    console.log('   1. 修改 server/app.js 中的监听配置');
    console.log('   2. 将 server.listen(PORT, ...) 改为 server.listen(PORT, "0.0.0.0", ...)');
    console.log('   3. 重启服务器: npm start');
    console.log('   4. 使用局域网IP访问，如: http://192.168.1.100:3000/quiz\n');
    
    console.log('🔧 方案2: 使用内网穿透工具');
    console.log('   1. 安装 ngrok: npm install -g ngrok');
    console.log('   2. 运行: ngrok http 3000');
    console.log('   3. 使用 ngrok 提供的公网地址\n');
    
    console.log('🔧 方案3: 检查防火墙设置');
    console.log('   1. 确保防火墙允许3000端口');
    console.log('   2. Windows: 控制面板 > 系统和安全 > Windows防火墙');
    console.log('   3. macOS: 系统偏好设置 > 安全性与隐私 > 防火墙\n');
    
    console.log('🔧 方案4: 使用云服务部署');
    console.log('   1. 部署到 Heroku、Vercel 或其他云平台');
    console.log('   2. 获得公网访问地址');
    console.log('   3. 任何人都可以访问\n');
    
    console.log('⚠️  常见问题:');
    console.log('   - localhost 只能本机访问');
    console.log('   - 127.0.0.1 只能本机访问');
    console.log('   - 需要使用局域网IP (如 192.168.x.x)');
    console.log('   - 确保设备在同一网络下');
    console.log('   - 检查路由器和防火墙设置\n');
    
    console.log('🎯 推荐操作:');
    console.log('   1. 运行此诊断脚本获取IP地址');
    console.log('   2. 修改服务器配置监听 0.0.0.0');
    console.log('   3. 使用局域网IP生成二维码');
    console.log('   4. 测试其他设备是否能访问\n');
}

// 主函数
async function main() {
    await diagnoseNetwork();
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { diagnoseNetwork };
