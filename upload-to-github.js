#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

async function main() {
    console.log('🚀 AI答题竞赛网站 - GitHub上传助手\n');
    console.log('='.repeat(50));
    
    try {
        // 检查git状态
        console.log('📁 检查Git状态...');
        execSync('git status', { stdio: 'pipe' });
        console.log('✅ Git仓库已准备就绪\n');
        
        // 获取用户信息
        console.log('请提供您的GitHub信息：\n');
        
        const username = await askQuestion('GitHub用户名: ');
        if (!username) {
            console.log('❌ 用户名不能为空');
            process.exit(1);
        }
        
        const repoName = await askQuestion('仓库名称 (直接回车使用 ai-quiz-website): ') || 'ai-quiz-website';
        
        console.log('\n📋 接下来的步骤：');
        console.log('1. 在GitHub上创建仓库');
        console.log('2. 上传代码到GitHub');
        console.log('3. 部署到Railway\n');
        
        const proceed = await askQuestion('是否继续？(y/n): ');
        if (proceed.toLowerCase() !== 'y') {
            console.log('操作已取消');
            process.exit(0);
        }
        
        // 设置远程仓库
        const repoUrl = `https://github.com/${username}/${repoName}.git`;
        
        console.log('\n🔗 设置远程仓库...');
        try {
            execSync('git remote remove origin', { stdio: 'ignore' });
        } catch (e) {
            // 忽略错误，可能没有远程仓库
        }
        
        execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
        console.log('✅ 远程仓库设置完成');
        
        console.log('\n📤 准备上传代码...');
        console.log('⚠️  请先在GitHub上创建仓库：');
        console.log(`   1. 访问 https://github.com/new`);
        console.log(`   2. 仓库名称: ${repoName}`);
        console.log(`   3. 设为 Public (公开)`);
        console.log(`   4. 不要勾选任何初始化选项`);
        console.log(`   5. 点击 "Create repository"`);
        
        const created = await askQuestion('\n仓库创建完成了吗？(y/n): ');
        if (created.toLowerCase() !== 'y') {
            console.log('请先创建GitHub仓库，然后重新运行此脚本');
            process.exit(0);
        }
        
        // 上传代码
        console.log('\n📤 上传代码到GitHub...');
        try {
            execSync('git branch -M main', { stdio: 'inherit' });
            execSync('git push -u origin main', { stdio: 'inherit' });
            console.log('\n✅ 代码上传成功！');
            
            console.log('\n🎉 GitHub仓库准备完成！');
            console.log(`📋 仓库地址: https://github.com/${username}/${repoName}`);
            
            // 部署指导
            console.log('\n🚀 下一步 - 部署到Railway：');
            console.log('1. 访问 https://railway.app');
            console.log('2. 点击 "Login" 使用GitHub登录');
            console.log('3. 点击 "New Project"');
            console.log('4. 选择 "Deploy from GitHub repo"');
            console.log(`5. 选择 "${repoName}" 仓库`);
            console.log('6. 点击 "Deploy Now"');
            console.log('7. 等待2-3分钟部署完成');
            console.log('\n部署完成后，您会获得一个公网地址！');
            
        } catch (error) {
            console.log('\n❌ 上传失败，可能的原因：');
            console.log('1. GitHub仓库未创建');
            console.log('2. 仓库名称不匹配');
            console.log('3. 网络连接问题');
            console.log('\n请检查后重试');
        }
        
    } catch (error) {
        console.log('❌ 发生错误:', error.message);
    } finally {
        rl.close();
    }
}

if (require.main === module) {
    main();
}
