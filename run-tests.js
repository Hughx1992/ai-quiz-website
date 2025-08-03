#!/usr/bin/env node

const { StressTestManager } = require('./stress-test');
const QuickTest = require('./quick-test');

function showHelp() {
    console.log(`
🧪 AI Quiz 系统测试工具

使用方法:
  node run-tests.js [选项]

选项:
  --quick, -q     运行快速测试 (10用户, 5题)
  --stress, -s    运行完整压力测试 (100用户, 20题)
  --local, -l     测试本地服务器 (localhost:3000)
  --help, -h      显示帮助信息

示例:
  node run-tests.js --quick          # 快速测试线上服务器
  node run-tests.js --stress         # 完整压力测试线上服务器
  node run-tests.js --quick --local  # 快速测试本地服务器
  node run-tests.js --stress --local # 完整压力测试本地服务器

注意:
  - 快速测试适合验证基本功能
  - 压力测试会消耗较多资源，请确保网络稳定
  - 本地测试需要先启动本地服务器 (npm start)
`);
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h') || args.length === 0) {
        showHelp();
        return;
    }

    const isQuick = args.includes('--quick') || args.includes('-q');
    const isStress = args.includes('--stress') || args.includes('-s');
    const isLocal = args.includes('--local') || args.includes('-l');

    if (!isQuick && !isStress) {
        console.log('❌ 请指定测试类型: --quick 或 --stress');
        showHelp();
        return;
    }

    // 设置服务器URL
    const serverUrl = isLocal 
        ? 'http://localhost:3000' 
        : 'https://web-production-a78b3.up.railway.app';

    console.log('🎯 AI Quiz 系统测试');
    console.log('='.repeat(50));
    console.log(`📍 服务器: ${serverUrl}`);
    console.log(`🧪 测试类型: ${isQuick ? '快速测试' : '完整压力测试'}`);
    console.log('='.repeat(50));

    try {
        if (isQuick) {
            // 修改快速测试的服务器URL
            const QuickTestClass = require('./quick-test');
            const originalConfig = require('./quick-test');
            
            // 临时修改配置
            const quickTest = new QuickTestClass();
            quickTest.constructor.prototype.CONFIG = {
                ...quickTest.constructor.prototype.CONFIG,
                SERVER_URL: serverUrl
            };
            
            await quickTest.runQuickTest();
        } else {
            // 修改压力测试的服务器URL
            const { StressTestManager } = require('./stress-test');
            
            // 临时修改配置
            const originalConfig = require('./stress-test');
            
            const stressTest = new StressTestManager();
            // 这里需要修改配置，但由于模块已加载，我们需要直接修改
            
            await stressTest.runStressTest();
        }
    } catch (error) {
        console.error('❌ 测试执行失败:', error.message);
        process.exit(1);
    }
}

// 处理中断信号
process.on('SIGINT', () => {
    console.log('\n\n⏹️ 测试被用户中断');
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ 未处理的Promise拒绝:', reason);
    process.exit(1);
});

if (require.main === module) {
    main().catch(console.error);
}
