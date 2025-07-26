# 🚀 部署步骤 - 为 Hughx1992

## 第一步：创建GitHub仓库

1. **访问GitHub创建仓库页面**
   - 点击这个链接：https://github.com/new
   - 或者访问 https://github.com 然后点击右上角的 "+" → "New repository"

2. **填写仓库信息**
   - Repository name: `ai-quiz-website`
   - Description: `AI答题竞赛网站 - 支持多人实时答题和排名`
   - 选择 **Public** (公开)
   - **不要勾选** "Add a README file"
   - **不要勾选** "Add .gitignore"
   - **不要勾选** "Choose a license"

3. **点击 "Create repository"**

## 第二步：上传代码到GitHub

创建仓库后，在您的项目文件夹中运行以下命令：

```bash
# 设置远程仓库
git remote add origin https://github.com/Hughx1992/ai-quiz-website.git

# 推送代码
git branch -M main
git push -u origin main
```

## 第三步：部署到Railway

1. **访问Railway**
   - 打开 https://railway.app
   - 点击 "Login"
   - 选择 "Login with GitHub"
   - 授权Railway访问您的GitHub账号

2. **创建新项目**
   - 登录后点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 在列表中找到 `ai-quiz-website` 仓库
   - 点击 "Deploy Now"

3. **等待部署完成**
   - Railway会自动检测Node.js项目
   - 自动运行 `npm install` 安装依赖
   - 自动启动服务器
   - 整个过程大约2-3分钟

4. **获取访问地址**
   - 部署完成后，点击项目
   - 在 "Deployments" 标签页可以看到部署状态
   - 在 "Settings" → "Domains" 可以看到分配的域名
   - 类似：`https://ai-quiz-website-production-xxxx.railway.app`

## 第四步：测试访问

部署完成后测试以下链接：
- **主页**: https://your-app.railway.app
- **答题页面**: https://your-app.railway.app/quiz
- **管理员面板**: https://your-app.railway.app/admin
- **排行榜**: https://your-app.railway.app/leaderboard

## 🎉 完成！

现在您的AI答题竞赛网站已经部署到云端，全世界的用户都可以通过移动数据网络访问了！

### 使用方法：
1. **管理员**：访问管理员面板开始竞赛
2. **参与者**：扫描主页二维码或直接访问答题链接
3. **分享**：把答题链接发给朋友们即可

### 如果遇到问题：
- 检查GitHub仓库是否创建成功
- 确认代码已成功推送到GitHub
- 在Railway控制台查看部署日志
- 等待几分钟让服务完全启动
