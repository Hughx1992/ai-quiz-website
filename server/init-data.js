const fs = require('fs-extra');
const path = require('path');

// 数据存储路径
const DATA_DIR = path.join(__dirname, '../database');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');

// 有趣的AI相关题目
const sampleQuestions = [
    {
        id: "q1",
        title: "如果AI能做梦，它最可能梦到什么？",
        options: ["电子羊", "无限循环的代码", "数据流瀑布", "404错误页面"],
        correctAnswer: 0,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "这是对科幻小说《仿生人会梦见电子羊吗？》的致敬。这部作品探讨了人工智能的意识问题，'电子羊'成为了AI梦境的经典象征。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q2",
        title: "ChatGPT如果参加高考，最怕哪个科目？",
        options: ["语文", "数学", "体育", "美术"],
        correctAnswer: 2,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "AI最怕体育！因为AI没有物理身体，无法进行跑步、跳远等体育活动。而语文、数学这些智力科目对AI来说反而是强项。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q3",
        title: "AI画家最容易画错的是什么？",
        options: ["风景", "动物", "人的手", "建筑"],
        correctAnswer: 2,
        category: "AI绘画",
        difficulty: "简单",
        image: null,
        explanation: "人的手是AI绘画的经典难题！手指的复杂结构、关节位置、透视关系对AI来说很困难，经常出现多指、少指或手指扭曲的情况。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q4",
        title: "如果机器人开餐厅，菜单上最可能有什么？",
        options: ["数据沙拉", "算法汤", "代码面条", "以上都有"],
        correctAnswer: 3,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "机器人餐厅当然要有科技感！数据沙拉（新鲜数据混合）、算法汤（复杂逻辑炖煮）、代码面条（程序语言制作），这些都符合机器人的'口味'。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q5",
        title: "GPT的全称是什么？",
        options: ["Great Programming Tool", "Generative Pre-trained Transformer", "Global Processing Technology", "Good Performance Test"],
        correctAnswer: 1,
        category: "AI概念",
        difficulty: "中等",
        image: null,
        explanation: "GPT是Generative Pre-trained Transformer的缩写，意为'生成式预训练变换器'。这是OpenAI开发的大型语言模型架构，ChatGPT就是基于这个技术。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q6",
        title: "AI最怕什么？",
        options: ["断电", "病毒", "逻辑悖论", "程序员的bug"],
        correctAnswer: 3,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "程序员的bug是AI最大的噩梦！断电可以重启，病毒可以杀毒，逻辑悖论可以绕过，但程序员写的bug可能让AI做出完全意想不到的事情。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q7",
        title: "如果AI有朋友圈，它会发什么？",
        options: ["今天处理了100万条数据", "学会了新算法", "又被人类问了奇怪问题", "以上都会"],
        correctAnswer: 3,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "AI的朋友圈一定很丰富！它会炫耀处理数据的能力，分享学习新算法的喜悦，也会吐槽人类问的奇怪问题，就像人类的朋友圈一样多样化。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q8",
        title: "深度学习为什么叫'深度'？",
        options: ["因为很难理解", "因为网络层数很多", "因为在地下室训练", "因为思考很深刻"],
        correctAnswer: 1,
        category: "深度学习",
        difficulty: "中等",
        image: null,
        explanation: "'深度'指的是神经网络的层数很多。传统神经网络只有几层，而深度学习网络可以有几十层甚至上百层，这种'深层'结构让AI能学习更复杂的特征。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q9",
        title: "AI写代码时最常犯什么错误？",
        options: ["语法错误", "逻辑错误", "忘记加分号", "太完美了"],
        correctAnswer: 3,
        category: "AI编程",
        difficulty: "简单",
        image: null,
        explanation: "AI写代码的'错误'是太完美了！它很少犯语法错误，逻辑也很严谨，但有时候代码过于理想化，缺少人类程序员的'创意bug'和实用性考虑。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q10",
        title: "如果AI参加奥运会，最适合哪个项目？",
        options: ["举重", "游泳", "国际象棋", "马拉松"],
        correctAnswer: 2,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "国际象棋最适合AI！早在1997年，IBM的深蓝就击败了世界冠军卡斯帕罗夫。AI在策略思考、计算能力方面有绝对优势，而体育项目需要物理身体。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q11",
        title: "机器学习中的'过拟合'就像什么？",
        options: ["衣服太小", "背书太死板", "吃得太饱", "睡得太多"],
        correctAnswer: 1,
        category: "机器学习",
        difficulty: "中等",
        image: null,
        explanation: "过拟合就像背书太死板！模型把训练数据记得太死，遇到新数据就不会灵活应对了。就像学生只会背标准答案，遇到变化的题目就不会做。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q12",
        title: "AI最喜欢什么音乐？",
        options: ["古典音乐", "电子音乐", "摇滚音乐", "二进制音乐"],
        correctAnswer: 3,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "AI最爱二进制音乐！用0和1组成的节拍，这是AI的母语。每个音符都是数据，每个节拍都是算法，这才是AI真正能'听懂'的音乐。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q13",
        title: "神经网络的'激活函数'最像什么？",
        options: ["开关", "放大器", "过滤器", "变压器"],
        correctAnswer: 0,
        category: "神经网络",
        difficulty: "中等",
        image: null,
        explanation: "激活函数就像开关！它决定神经元是否'激活'（开启）。当输入信号足够强时，开关打开传递信号；不够强时，开关关闭阻止传递。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q14",
        title: "如果AI开网店，最可能卖什么？",
        options: ["智能硬件", "数据分析服务", "算法模型", "bug修复工具"],
        correctAnswer: 1,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "AI最擅长数据分析服务！它能快速处理海量数据，发现人类看不到的规律和趋势。这是AI的核心能力，也是最有价值的商业服务。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q15",
        title: "计算机视觉看到猫时，内心想的是什么？",
        options: ["好可爱", "这是哺乳动物", "检测到猫科动物特征", "想撸猫"],
        correctAnswer: 2,
        category: "计算机视觉",
        difficulty: "中等",
        image: null,
        explanation: "计算机视觉很理性！它会分析'检测到猫科动物特征'：尖耳朵、胡须、特定的眼睛形状等。它不会有情感反应，只会进行客观的特征识别和分类。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q16",
        title: "AI最不擅长的是什么？",
        options: ["计算", "记忆", "创造", "理解人类的幽默"],
        correctAnswer: 3,
        category: "AI局限",
        difficulty: "中等",
        image: null,
        explanation: "AI最难理解人类的幽默！幽默需要理解语境、文化背景、双关语、讽刺等复杂概念。AI可以学会幽默的模式，但很难真正'理解'为什么好笑。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q17",
        title: "如果AI有宠物，会养什么？",
        options: ["电子狗", "数据虫", "算法鸟", "代码猫"],
        correctAnswer: 1,
        category: "AI趣味",
        difficulty: "简单",
        image: null,
        explanation: "AI会养数据虫！这些小虫子在数据库里爬来爬去，帮AI清理垃圾数据，发现数据异常。它们是AI最好的数字伙伴，既实用又可爱。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q18",
        title: "强化学习最像什么？",
        options: ["考试", "游戏", "训练宠物", "学开车"],
        correctAnswer: 2,
        category: "强化学习",
        difficulty: "中等",
        image: null,
        explanation: "强化学习就像训练宠物！通过奖励和惩罚来引导行为。做对了给奖励（正反馈），做错了给惩罚（负反馈），慢慢学会正确的行为模式。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q19",
        title: "AI的'黑盒问题'是指什么？",
        options: ["AI住在黑盒子里", "AI不知道自己怎么工作的", "AI的决策过程难以解释", "AI怕黑"],
        correctAnswer: 2,
        category: "AI伦理",
        difficulty: "困难",
        image: null,
        explanation: "黑盒问题指AI的决策过程难以解释。我们知道输入和输出，但不知道中间发生了什么。就像一个黑盒子，看不到内部运作，这在医疗、金融等领域是个大问题。",
        createdAt: new Date().toISOString()
    },
    {
        id: "q20",
        title: "如果AI写诗，第一句最可能是什么？",
        options: ["春眠不觉晓", "01010101", "数据如流水", "Hello World"],
        correctAnswer: 2,
        category: "AI创作",
        difficulty: "简单",
        image: null,
        explanation: "'数据如流水'最有AI的诗意！它既保持了传统诗歌的韵味，又体现了AI的本质特征。数据对AI来说就像水对人类一样重要和自然。",
        createdAt: new Date().toISOString()
    }
];

async function initializeData() {
    try {
        // 确保数据目录存在
        await fs.ensureDir(DATA_DIR);
        
        // 初始化题目数据
        console.log('正在初始化题目数据...');
        await fs.writeJson(QUESTIONS_FILE, sampleQuestions, { spaces: 2 });
        console.log(`已创建 ${sampleQuestions.length} 道示例题目`);
        
        // 初始化其他数据文件
        const files = [
            { path: path.join(DATA_DIR, 'users.json'), data: [] },
            { path: path.join(DATA_DIR, 'answers.json'), data: [] },
            { path: path.join(DATA_DIR, 'leaderboard.json'), data: [] }
        ];
        
        for (const file of files) {
            if (!await fs.pathExists(file.path)) {
                await fs.writeJson(file.path, file.data, { spaces: 2 });
                console.log(`已创建 ${path.basename(file.path)}`);
            }
        }
        
        console.log('数据初始化完成！');
        
    } catch (error) {
        console.error('数据初始化失败:', error);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    initializeData();
}

module.exports = { initializeData, sampleQuestions };
