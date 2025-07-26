#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI答题竞赛网站 - 一键部署脚本\n');

// 检查是否已初始化git
function checkGitInit() {
    try {
        execSync('git status', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// 初始化git仓库
function initGit() {
    console.log('📁 初始化Git仓库...');
    try {
        if (!checkGitInit()) {
            execSync('git init', { stdio: 'inherit' });
        }
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "Ready for deployment" || true', { stdio: 'inherit' });
        console.log('✅ Git仓库准备完成\n');
    } catch (error) {
        console.log('⚠️  Git初始化可能有问题，但可以继续部署\n');
    }
}

// 检查Railway CLI
function checkRailwayCLI() {
    try {
        execSync('railway --version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// 安装Railway CLI
function installRailwayCLI() {
    console.log('📦 安装Railway CLI...');
    try {
        execSync('npm install -g @railway/cli', { stdio: 'inherit' });
        console.log('✅ Railway CLI安装完成\n');
        return true;
    } catch (error) {
        console.log('❌ Railway CLI安装失败');
        console.log('请手动安装: npm install -g @railway/cli\n');
        return false;
    }
}

// Railway部署
function deployToRailway() {
    console.log('🚂 开始Railway部署...');
    try {
        console.log('请在浏览器中登录Railway账号...');
        execSync('railway login', { stdio: 'inherit' });
        
        console.log('初始化Railway项目...');
        execSync('railway init', { stdio: 'inherit' });
        
        console.log('设置环境变量...');
        execSync('railway variables set NODE_ENV=production', { stdio: 'inherit' });
        
        console.log('开始部署...');
        execSync('railway up', { stdio: 'inherit' });
        
        console.log('\n🎉 部署完成！');
        console.log('获取访问链接...');
        
        try {
            const domain = execSync('railway domain', { encoding: 'utf8' }).trim();
            console.log(`\n🌐 您的网站地址: ${domain}`);
            console.log(`📱 答题链接: ${domain}/quiz`);
            console.log(`👨‍💼 管理员链接: ${domain}/admin`);
        } catch {
            console.log('\n请在Railway控制台查看您的域名地址');
        }
        
        return true;
    } catch (error) {
        console.log('❌ Railway部署失败');
        console.log('错误信息:', error.message);
        return false;
    }
}

// 显示手动部署指南
function showManualDeployment() {
    console.log('📋 手动部署指南:\n');
    
    console.log('🚂 Railway部署:');
    console.log('1. 访问 https://railway.app');
    console.log('2. 使用GitHub登录');
    console.log('3. 点击 "New Project"');
    console.log('4. 选择 "Deploy from GitHub repo"');
    console.log('5. 选择您的项目仓库');
    console.log('6. 等待自动部署完成\n');
    
    console.log('🎨 Render部署:');
    console.log('1. 访问 https://render.com');
    console.log('2. 注册并连接GitHub');
    console.log('3. 点击 "New +" → "Web Service"');
    console.log('4. 选择您的仓库');
    console.log('5. 配置构建命令: npm install');
    console.log('6. 配置启动命令: node server/app.js\n');
    
    console.log('🔧 环境变量设置:');
    console.log('NODE_ENV=production\n');
}

// 主函数
async function main() {
    console.log('='.repeat(50));
    
    // 1. 准备Git仓库
    initGit();
    
    // 2. 选择部署方式
    console.log('请选择部署方式:');
    console.log('1. 自动部署到Railway (推荐)');
    console.log('2. 显示手动部署指南');
    console.log('3. 退出\n');
    
    // 简化版本：直接显示指南
    console.log('📋 推荐使用Railway进行部署:\n');
    
    if (!checkRailwayCLI()) {
        console.log('⚠️  未检测到Railway CLI');
        if (!installRailwayCLI()) {
            showManualDeployment();
            return;
        }
    }
    
    console.log('🎯 Railway CLI已准备就绪');
    console.log('运行以下命令进行部署:\n');
    console.log('railway login    # 登录Railway');
    console.log('railway init     # 初始化项目');
    console.log('railway up       # 开始部署\n');
    
    showManualDeployment();
    
    console.log('🎉 部署准备完成！');
    console.log('选择上述任一方式进行部署，部署后即可全球访问！');
}

// 运行脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main };
