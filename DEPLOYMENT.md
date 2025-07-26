# 🚀 AI答题竞赛网站 - 云部署指南

## 🎯 部署目标
让参与者通过移动数据网络也能访问答题网站，无需连接同一WiFi。

## 📋 推荐部署平台

### 1. Railway (推荐) ⭐⭐⭐⭐⭐
- ✅ 免费额度充足
- ✅ 部署简单快速
- ✅ 自动HTTPS
- ✅ 支持WebSocket

### 2. Render ⭐⭐⭐⭐
- ✅ 免费计划可用
- ✅ 自动部署
- ✅ 内置SSL

### 3. Heroku ⭐⭐⭐
- ⚠️ 免费计划已取消
- ✅ 功能完善

## 🚀 Railway 部署步骤

### 步骤1: 准备代码
```bash
# 确保所有文件已保存
git init
git add .
git commit -m "Initial commit for deployment"
```

### 步骤2: 部署到Railway
1. 访问 https://railway.app
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"
5. 选择您的项目仓库
6. Railway会自动检测Node.js项目并开始部署

### 步骤3: 配置环境变量
在Railway项目设置中添加：
```
NODE_ENV=production
```

### 步骤4: 获取访问链接
部署完成后，Railway会提供一个公网域名，如：
```
https://your-app-name.railway.app
```

## 🌐 Render 部署步骤

### 步骤1: 创建GitHub仓库
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-quiz-website.git
git push -u origin main
```

### 步骤2: 部署到Render
1. 访问 https://render.com
2. 注册并连接GitHub账号
3. 点击 "New +" → "Web Service"
4. 选择您的GitHub仓库
5. 配置部署设置：
   - **Name**: ai-quiz-website
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server/app.js`

### 步骤3: 配置环境变量
```
NODE_ENV=production
```

## 📱 部署后使用

### 获取访问链接
部署成功后，您会得到一个公网地址，例如：
- Railway: `https://ai-quiz-website-production.railway.app`
- Render: `https://ai-quiz-website.onrender.com`

### 分享给参与者
```
答题链接: https://your-app.railway.app/quiz
管理员链接: https://your-app.railway.app/admin
```

### 生成新二维码
访问主页，系统会自动生成包含公网地址的二维码。

## ⚡ 快速部署 (推荐Railway)

### 一键部署按钮
如果您的代码在GitHub上，可以使用一键部署：

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### 手动部署命令
```bash
# 1. 安装Railway CLI
npm install -g @railway/cli

# 2. 登录Railway
railway login

# 3. 初始化项目
railway init

# 4. 部署
railway up
```

## 🔧 部署后配置

### 1. 检查服务状态
访问 `https://your-app.railway.app` 确保服务正常运行

### 2. 测试功能
- 答题功能: `/quiz`
- 管理面板: `/admin`
- 排行榜: `/leaderboard`

### 3. 监控日志
在Railway/Render控制台查看应用日志，确保没有错误

## 🎯 使用指南

### 管理员操作
1. 访问 `https://your-app.railway.app/admin`
2. 开始竞赛，推送题目
3. 监控参与者答题情况

### 参与者操作
1. 扫描二维码或访问 `https://your-app.railway.app/quiz`
2. 输入昵称开始答题
3. 实时查看排行榜

## 💡 优化建议

### 1. 自定义域名
- Railway: 在项目设置中添加自定义域名
- Render: 在服务设置中配置域名

### 2. 环境变量
```
NODE_ENV=production
APP_URL=https://your-custom-domain.com
```

### 3. 数据持久化
考虑使用云数据库存储题目和用户数据：
- Railway: 内置PostgreSQL
- MongoDB Atlas: 免费云数据库

## 🔍 故障排除

### 部署失败
1. 检查package.json中的依赖
2. 确保Node.js版本兼容
3. 查看部署日志

### 访问问题
1. 确认服务已启动
2. 检查端口配置
3. 验证环境变量

### WebSocket连接问题
1. 确保平台支持WebSocket
2. 检查CORS配置
3. 验证Socket.IO版本

## 🎉 部署完成

部署成功后，您的AI答题竞赛网站将：
- ✅ 支持全球访问
- ✅ 自动HTTPS加密
- ✅ 高可用性
- ✅ 移动端友好

现在参与者可以通过任何网络（WiFi或移动数据）访问您的答题网站了！
