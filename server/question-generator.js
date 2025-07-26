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
