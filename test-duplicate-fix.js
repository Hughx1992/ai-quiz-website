const http = require('http');

// 测试题目重复问题修复
async function testDuplicateFix() {
    console.log('🔍 测试题目重复问题修复\n');
    console.log('='.repeat(60));
    
    // 测试1: 检查题库更新
    await testQuestionDatabase();
    
    // 测试2: 测试随机选题不重复
    await testRandomSelection();
    
    console.log('\n✅ 题目重复问题修复测试完成！');
}

// 测试题库更新
async function testQuestionDatabase() {
    console.log('📚 检查题库更新...');
    
    try {
        const response = await makeRequest('/api/questions');
        if (response.statusCode === 200) {
            const questions = JSON.parse(response.data);
            console.log(`✅ 题库包含 ${questions.length} 道题目`);
            
            // 检查题目内容
            console.log('\n📝 新题目示例:');
            questions.slice(0, 5).forEach((q, index) => {
                console.log(`   ${index + 1}. ${q.title}`);
                console.log(`      分类: ${q.category} | 难度: ${q.difficulty}`);
            });
            
            // 检查题目唯一性
            const titles = questions.map(q => q.title);
            const uniqueTitles = [...new Set(titles)];
            
            if (titles.length === uniqueTitles.length) {
                console.log(`✅ 题目标题无重复 (${titles.length}/${uniqueTitles.length})`);
            } else {
                console.log(`❌ 发现重复题目标题 (${titles.length}/${uniqueTitles.length})`);
            }
            
            // 检查ID唯一性
            const ids = questions.map(q => q.id);
            const uniqueIds = [...new Set(ids)];
            
            if (ids.length === uniqueIds.length) {
                console.log(`✅ 题目ID无重复 (${ids.length}/${uniqueIds.length})`);
            } else {
                console.log(`❌ 发现重复题目ID (${ids.length}/${uniqueIds.length})`);
            }
            
        } else {
            console.log(`❌ 获取题库失败，状态码: ${response.statusCode}`);
        }
    } catch (error) {
        console.log(`❌ 题库检查错误: ${error.message}`);
    }
    console.log('');
}

// 测试随机选题不重复
async function testRandomSelection() {
    console.log('🎲 测试随机选题不重复功能...');
    
    try {
        // 先停止竞赛（如果正在进行）
        await makeRequest('/api/admin/stop-quiz', 'POST');
        
        console.log('🎮 开始连续选题测试...');
        
        const selectedQuestions = [];
        const maxTests = 10; // 测试10次选题
        
        for (let i = 0; i < maxTests; i++) {
            let response;
            
            if (i === 0) {
                // 第一次开始竞赛
                response = await makeRequest('/api/admin/start-quiz', 'POST');
            } else {
                // 后续选择下一题
                response = await makeRequest('/api/admin/next-question', 'POST');
            }
            
            if (response.statusCode === 200) {
                const data = JSON.parse(response.data);
                if (data.question) {
                    selectedQuestions.push({
                        id: data.question.id,
                        title: data.question.title,
                        round: i + 1
                    });
                    console.log(`   第${i + 1}轮: ${data.question.title.substring(0, 30)}...`);
                } else {
                    console.log(`   第${i + 1}轮: 未获取到题目`);
                }
            } else {
                console.log(`   第${i + 1}轮: 请求失败 (${response.statusCode})`);
            }
            
            // 短暂延迟
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // 分析重复情况
        console.log('\n📊 选题结果分析:');
        const questionIds = selectedQuestions.map(q => q.id);
        const uniqueIds = [...new Set(questionIds)];
        
        console.log(`   总选题次数: ${selectedQuestions.length}`);
        console.log(`   不同题目数: ${uniqueIds.length}`);
        console.log(`   重复率: ${((selectedQuestions.length - uniqueIds.length) / selectedQuestions.length * 100).toFixed(1)}%`);
        
        if (uniqueIds.length === selectedQuestions.length) {
            console.log('✅ 完全无重复！随机选题算法工作正常');
        } else if (uniqueIds.length >= selectedQuestions.length * 0.8) {
            console.log('✅ 重复率较低，算法工作良好');
        } else {
            console.log('⚠️  重复率较高，可能需要进一步优化');
        }
        
        // 显示重复的题目
        const duplicates = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
            console.log('\n🔄 重复的题目:');
            duplicates.forEach(dupId => {
                const rounds = selectedQuestions
                    .filter(q => q.id === dupId)
                    .map(q => q.round);
                const title = selectedQuestions.find(q => q.id === dupId).title;
                console.log(`   "${title.substring(0, 40)}..." (第${rounds.join(', ')}轮)`);
            });
        }
        
        // 停止竞赛
        await makeRequest('/api/admin/stop-quiz', 'POST');
        console.log('🛑 测试完成，竞赛已停止');
        
    } catch (error) {
        console.log(`❌ 随机选题测试错误: ${error.message}`);
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

// 显示修复说明
function showFixExplanation() {
    console.log('🔧 题目重复问题修复说明:\n');
    
    console.log('❌ 原问题:');
    console.log('   1. 随机选题使用简单的Math.random()，容易重复');
    console.log('   2. 没有记录已使用的题目，导致短时间内重复出现');
    console.log('   3. 题库内容相对单调，缺乏趣味性\n');
    
    console.log('✅ 修复方案:');
    console.log('   1. 添加usedQuestionIds Set记录已使用题目');
    console.log('   2. 实现getRandomUniqueQuestion()函数避免重复');
    console.log('   3. 当所有题目用完时自动重置题目池');
    console.log('   4. 更新题库为20道有趣的AI相关题目\n');
    
    console.log('📝 技术实现:');
    console.log('   - 全局变量: let usedQuestionIds = new Set()');
    console.log('   - 过滤函数: questions.filter(q => !usedQuestionIds.has(q.id))');
    console.log('   - 自动重置: 当usedQuestionIds.size >= questions.length时清空');
    console.log('   - 日志记录: 显示剩余未使用题目数量\n');
    
    console.log('🎯 预期效果:');
    console.log('   - 短期内不会出现重复题目');
    console.log('   - 所有题目用完后自动循环');
    console.log('   - 题目内容更加有趣和多样化');
    console.log('   - 管理员可以看到选题日志\n');
}

// 主函数
async function main() {
    console.log('🚀 AI答题竞赛网站 - 题目重复问题修复测试\n');
    
    showFixExplanation();
    
    console.log('='.repeat(60));
    await testDuplicateFix();
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { testDuplicateFix };
