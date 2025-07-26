# 🚀 快速部署指南 - 让全世界都能访问您的答题网站

## 🎯 目标
让参与者通过移动数据网络访问，无需连接同一WiFi

## ⚡ 最简单的部署方式 (推荐Railway)

### 步骤1: 上传到GitHub
1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 仓库名称: `ai-quiz-website`
4. 设为Public
5. 点击 "Create repository"

### 步骤2: 上传代码
在您的项目文件夹中运行：
```bash
git remote add origin https://github.com/您的用户名/ai-quiz-website.git
git branch -M main
git push -u origin main
```

### 步骤3: 部署到Railway
1. 访问 https://railway.app
2. 点击 "Login" 使用GitHub账号登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 选择 `ai-quiz-website` 仓库
6. 点击 "Deploy Now"

### 步骤4: 等待部署完成
- Railway会自动检测Node.js项目
- 自动安装依赖并启动服务
- 大约2-3分钟完成部署

### 步骤5: 获取访问链接
部署完成后，您会看到类似这样的链接：
```
https://ai-quiz-website-production-xxxx.railway.app
```

## 🎉 部署完成！

### 分享给参与者
- **答题链接**: https://your-app.railway.app/quiz
- **管理员链接**: https://your-app.railway.app/admin

### 生成新二维码
访问主页，系统会自动生成包含公网地址的二维码

## 🔧 备选方案 - Render部署

如果Railway有问题，可以使用Render：

1. 访问 https://render.com
2. 使用GitHub登录
3. 点击 "New +" → "Web Service"
4. 选择您的GitHub仓库
5. 配置：
   - **Name**: ai-quiz-website
   - **Build Command**: `npm install`
   - **Start Command**: `node server/app.js`
6. 点击 "Create Web Service"

## 📱 使用方法

### 管理员操作
1. 访问管理员链接
2. 开始竞赛，推送题目
3. 在控制面板查看答案解释

### 参与者操作
1. 扫描二维码或点击答题链接
2. 输入昵称开始答题
3. 实时查看排行榜

## 🎯 优势

- ✅ **全球访问**: 任何网络都能访问
- ✅ **免费使用**: Railway/Render都有免费额度
- ✅ **自动HTTPS**: 安全加密连接
- ✅ **高可用性**: 云平台保证稳定性
- ✅ **移动友好**: 完美支持手机访问

## 🔍 故障排除

### 如果部署失败
1. 检查GitHub仓库是否公开
2. 确认所有文件都已上传
3. 查看部署日志中的错误信息

### 如果访问不了
1. 等待几分钟让部署完全完成
2. 检查服务是否正在运行
3. 尝试刷新页面

## 💡 小贴士

- 部署后第一次访问可能需要等待几秒钟（冷启动）
- 可以在Railway/Render控制台查看实时日志
- 如需修改代码，推送到GitHub后会自动重新部署

现在您的AI答题竞赛网站可以被全世界访问了！🌍
