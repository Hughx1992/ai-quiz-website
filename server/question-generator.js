const { v4: uuidv4 } = require('uuid');

// AI相关题目模板
const questionTemplates = {
    // AI概念类题目
    concepts: [
        {
            template: "什么是{concept}？",
            concepts: [
                {
                    name: "机器学习",
                    correct: "一种让计算机从数据中学习的方法",
                    wrong: ["一种编程语言", "一种数据库技术", "一种硬件设备"]
                },
                {
                    name: "深度学习",
                    correct: "使用多层神经网络的机器学习方法",
                    wrong: ["一种数据挖掘技术", "一种云计算服务", "一种图像处理算法"]
                },
                {
                    name: "神经网络",
                    correct: "模拟人脑神经元连接的计算模型",
                    wrong: ["一种网络协议", "一种数据结构", "一种操作系统"]
                },
                {
                    name: "自然语言处理",
                    correct: "让计算机理解和处理人类语言的技术",
                    wrong: ["一种编程范式", "一种数据库查询语言", "一种网络通信协议"]
                },
                {
                    name: "计算机视觉",
                    correct: "让计算机理解和分析图像的技术",
                    wrong: ["一种文字处理技术", "一种音频分析技术", "一种数据存储技术"]
                },
                {
                    name: "强化学习",
                    correct: "通过奖惩机制训练AI的学习方法",
                    wrong: ["一种监督学习方法", "一种无监督学习方法", "一种数据预处理技术"]
                }
            ]
        },
        {
            template: "{concept}的主要特点是什么？",
            concepts: [
                {
                    name: "机器学习",
                    correct: "能够从经验中学习和改进",
                    wrong: ["需要显式编程所有规则", "只能处理结构化数据", "无法适应新数据"]
                },
                {
                    name: "深度学习",
                    correct: "能够自动学习特征表示",
                    wrong: ["需要人工特征工程", "只能处理浅层网络", "不适合大规模数据"]
                },
                {
                    name: "神经网络",
                    correct: "具有并行处理能力",
                    wrong: ["只能线性计算", "无法处理非线性问题", "计算速度很慢"]
                }
            ]
        },
        {
            template: "{concept}的主要应用领域不包括？",
            concepts: [
                {
                    name: "计算机视觉",
                    wrong: ["图像识别", "人脸检测", "医学影像分析"],
                    correct: "文本翻译"
                },
                {
                    name: "强化学习",
                    wrong: ["游戏AI", "机器人控制", "推荐系统"],
                    correct: "图像压缩"
                },
                {
                    name: "自然语言处理",
                    wrong: ["机器翻译", "情感分析", "文本摘要"],
                    correct: "图像生成"
                }
            ]
        },
        {
            template: "以下哪项不是{concept}的应用？",
            concepts: [
                {
                    name: "机器学习",
                    wrong: ["垃圾邮件过滤", "推荐系统", "图像识别"],
                    correct: "文件压缩"
                },
                {
                    name: "深度学习",
                    wrong: ["语音识别", "自动驾驶", "医疗诊断"],
                    correct: "数据备份"
                }
            ]
        }
    ],
    
    // AI技术比较类题目
    comparisons: [
        {
            question: "监督学习和无监督学习的主要区别是什么？",
            correct: "监督学习使用标记数据，无监督学习使用未标记数据",
            wrong: [
                "监督学习更准确，无监督学习更快速",
                "监督学习用于分类，无监督学习用于回归",
                "监督学习需要更多计算资源"
            ]
        },
        {
            question: "CNN和RNN的主要区别是什么？",
            correct: "CNN主要用于图像处理，RNN主要用于序列数据",
            wrong: [
                "CNN更复杂，RNN更简单",
                "CNN用于分类，RNN用于回归",
                "CNN是监督学习，RNN是无监督学习"
            ]
        },
        {
            question: "传统机器学习和深度学习的主要区别是什么？",
            correct: "深度学习不需要手动特征工程",
            wrong: [
                "深度学习只用于图像处理",
                "传统机器学习更准确",
                "深度学习需要更少的数据"
            ]
        },
        {
            question: "NLP中的BERT和GPT的主要区别是什么？",
            correct: "BERT是双向编码器，GPT是自回归解码器",
            wrong: [
                "BERT只能用于英文，GPT支持多语言",
                "BERT比GPT更强大",
                "GPT是开源的，BERT是闭源的"
            ]
        },
        {
            question: "强化学习和监督学习的主要区别是什么？",
            correct: "强化学习通过环境反馈学习，监督学习通过标记数据学习",
            wrong: [
                "强化学习更简单，监督学习更复杂",
                "强化学习用于分类，监督学习用于控制",
                "强化学习不需要数据，监督学习需要大量数据"
            ]
        }
    ],
    
    // AI伦理和社会影响类题目
    ethics: [
        {
            question: "AI系统中的算法偏见主要来源于什么？",
            correct: "训练数据中的偏见和不平衡",
            wrong: [
                "算法本身的复杂性",
                "计算机硬件的限制",
                "程序员的编程错误"
            ]
        },
        {
            question: "以下哪个不是AI伦理的主要关注点？",
            wrong: ["隐私保护", "算法透明度", "公平性"],
            correct: "运行速度"
        },
        {
            question: "AI决策过程的透明度主要是指什么？",
            correct: "能够解释AI做出决策的原因",
            wrong: [
                "AI系统的运行速度",
                "AI系统的硬件配置",
                "AI系统的代码长度"
            ]
        },
        {
            question: "AI系统的隐私保护主要关注什么？",
            correct: "如何保护用户训练数据和个人信息",
            wrong: [
                "如何提高AI运行速度",
                "如何减少AI硬件成本",
                "如何简化AI算法"
            ]
        },
        {
            question: "AI的公平性主要体现在什么方面？",
            correct: "避免对特定群体产生歧视性结果",
            wrong: [
                "让所有AI系统免费使用",
                "保证AI系统运行速度相同",
                "确保AI系统界面一致"
            ]
        }
    ],
    
    // AI历史和发展类题目
    history: [
        {
            question: "图灵测试主要用来测试什么？",
            correct: "机器是否具有智能",
            wrong: [
                "机器的计算速度",
                "机器的存储容量",
                "机器的网络连接能力"
            ]
        },
        {
            question: "以下哪个不是AI发展的重要里程碑？",
            wrong: ["深蓝击败国际象棋世界冠军", "AlphaGo击败围棋世界冠军", "GPT模型的发布"],
            correct: "第一台个人计算机的发明"
        },
        {
            question: "深度学习的概念最早起源于哪个年代？",
            correct: "1940年代",
            wrong: [
                "1960年代",
                "1980年代",
                "2000年代"
            ]
        },
        {
            question: "谁被称为'人工智能之父'？",
            correct: "艾伦·图灵",
            wrong: [
                "比尔·盖茨",
                "史蒂夫·乔布斯",
                "马克·扎克伯格"
            ]
        },
        {
            question: "GPT模型中的'T'代表什么？",
            correct: "Transformer",
            wrong: [
                "Technology",
                "Thinking",
                "Text"
            ]
        }
    ]
};

// 生成单个题目
function generateSingleQuestion(category, difficulty = '中等') {
    const templates = questionTemplates[category];
    if (!templates || templates.length === 0) {
        return null;
    }
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    if (template.template) {
        // 使用模板生成题目
        const concept = template.concepts[Math.floor(Math.random() * template.concepts.length)];
        const question = template.template.replace('{concept}', concept.name);
        
        const options = [concept.correct, ...concept.wrong];
        const correctIndex = 0;
        
        // 打乱选项顺序
        const shuffledOptions = shuffleArray([...options]);
        const newCorrectIndex = shuffledOptions.indexOf(concept.correct);
        
        return {
            id: uuidv4(),
            title: question,
            options: shuffledOptions,
            correctAnswer: newCorrectIndex,
            category: getCategoryName(category),
            difficulty: difficulty,
            image: null,
            createdAt: new Date().toISOString(),
            generated: true
        };
    } else {
        // 直接使用预定义题目
        const options = [template.correct, ...template.wrong];
        const correctIndex = 0;
        
        // 打乱选项顺序
        const shuffledOptions = shuffleArray([...options]);
        const newCorrectIndex = shuffledOptions.indexOf(template.correct);
        
        return {
            id: uuidv4(),
            title: template.question,
            options: shuffledOptions,
            correctAnswer: newCorrectIndex,
            category: getCategoryName(category),
            difficulty: difficulty,
            image: null,
            createdAt: new Date().toISOString(),
            generated: true
        };
    }
}

// 批量生成题目
function generateQuestions(count = 5, categories = null, difficulty = '中等') {
    const availableCategories = categories || Object.keys(questionTemplates);
    const questions = [];
    
    for (let i = 0; i < count; i++) {
        const category = availableCategories[Math.floor(Math.random() * availableCategories.length)];
        const question = generateSingleQuestion(category, difficulty);
        
        if (question) {
            questions.push(question);
        }
    }
    
    return questions;
}

// 根据主题生成特定类型的题目
function generateQuestionsByTheme(theme, count = 3) {
    const themeMapping = {
        'AI基础概念': ['concepts'],
        'AI技术比较': ['comparisons'],
        'AI伦理': ['ethics'],
        'AI历史': ['history'],
        '综合': Object.keys(questionTemplates)
    };
    
    const categories = themeMapping[theme] || themeMapping['综合'];
    return generateQuestions(count, categories);
}

// 生成图片识别类题目（模拟）
function generateImageRecognitionQuestions(count = 2) {
    const imageQuestions = [
        {
            title: "以下哪种技术最适合用于图像分类？",
            correct: "卷积神经网络(CNN)",
            wrong: ["循环神经网络(RNN)", "决策树", "线性回归"]
        },
        {
            title: "在计算机视觉中，什么是特征提取？",
            correct: "从图像中识别和提取有用信息的过程",
            wrong: ["改变图像大小的过程", "图像压缩的过程", "图像存储的过程"]
        },
        {
            title: "以下哪个不是常见的图像预处理步骤？",
            wrong: ["尺寸调整", "归一化", "数据增强"],
            correct: "文本分析"
        }
    ];
    
    const questions = [];
    for (let i = 0; i < Math.min(count, imageQuestions.length); i++) {
        const template = imageQuestions[i];
        const options = [template.correct, ...template.wrong];
        const correctIndex = 0;
        
        // 打乱选项顺序
        const shuffledOptions = shuffleArray([...options]);
        const newCorrectIndex = shuffledOptions.indexOf(template.correct);
        
        questions.push({
            id: uuidv4(),
            title: template.title,
            options: shuffledOptions,
            correctAnswer: newCorrectIndex,
            category: "计算机视觉",
            difficulty: "中等",
            image: null,
            createdAt: new Date().toISOString(),
            generated: true
        });
    }
    
    return questions;
}

// 工具函数：打乱数组
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 工具函数：获取分类名称
function getCategoryName(category) {
    const categoryNames = {
        concepts: "AI概念",
        comparisons: "AI技术",
        ethics: "AI伦理",
        history: "AI历史"
    };
    return categoryNames[category] || "AI综合";
}

// 获取可用的生成主题
function getAvailableThemes() {
    return [
        'AI基础概念',
        'AI技术比较', 
        'AI伦理',
        'AI历史',
        '综合'
    ];
}

// 获取难度级别
function getDifficultyLevels() {
    return ['简单', '中等', '困难'];
}

module.exports = {
    generateSingleQuestion,
    generateQuestions,
    generateQuestionsByTheme,
    generateImageRecognitionQuestions,
    getAvailableThemes,
    getDifficultyLevels
};
