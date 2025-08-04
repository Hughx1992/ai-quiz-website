# AI答题竞赛网站 - 设计规范文档 (DESIGN_SPEC)

## 1. 设计系统概述

### 1.1 设计理念
**赛博朋克未来科技主题** - 融合高科技与低生活的视觉美学，创造沉浸式的数字竞赛体验。

### 1.2 核心原则
- **视觉一致性**: 统一的色彩、字体和交互模式
- **响应式体验**: 完美适配移动端、平板和PC端
- **性能优先**: 流畅的动画和快速的响应
- **无障碍设计**: 考虑色盲用户和操作便利性

### 1.3 设计语言
- **主题风格**: 赛博朋克/未来科技/数字美学
- **情感基调**: 神秘、刺激、高科技、未来感
- **品牌识别**: 霓虹色彩、几何图形、发光效果

## 2. 色彩系统

### 2.1 主色调定义
```css
/* 主要色彩变量 */
--cyber-primary: #00ffff;      /* 青色 - 主要品牌色 */
--cyber-secondary: #ff00ff;    /* 紫色 - 次要强调色 */
--cyber-accent: #00ff41;       /* 绿色 - 成功/激活状态 */
--cyber-warning: #ffff00;      /* 黄色 - 警告状态 */
--cyber-danger: #ff073a;        /* 红色 - 危险/错误状态 */

/* 中性色彩 */
--cyber-dark: #0a0a0a;          /* 深黑 - 主背景 */
--cyber-darker: #050505;        /* 更深黑 - 强调背景 */
--cyber-light: #1a1a2e;         /* 深蓝 - 卡片背景 */
--cyber-lighter: #16213e;       /* 中蓝 - 次要背景 */

/* 文本色彩 */
--cyber-text: #e0e0e0;          /* 主要文本 */
--cyber-text-dim: #a0a0a0;      /* 次要文本 */
--cyber-text-bright: #ffffff;   /* 高亮文本 */
```

### 2.2 色彩应用规范
| 色彩 | 用途 | 16进制 | RGB | 使用场景 |
|------|------|--------|-----|----------|
| 青色 | 主要品牌 | #00ffff | 0,255,255 | 标题、按钮、链接 |
| 紫色 | 次要强调 | #ff00ff | 255,0,255 | 装饰、强调元素 |
| 绿色 | 成功状态 | #00ff41 | 0,255,65 | 正确答案、成功提示 |
| 黄色 | 警告状态 | #ffff00 | 255,255,0 | 倒计时警告、注意提示 |
| 红色 | 错误状态 | #ff073a | 255,7,58 | 错误提示、危险操作 |
| 深黑 | 主背景 | #0a0a0a | 10,10,10 | 页面背景 |
| 深蓝 | 卡片背景 | #1a1a2e | 26,26,46 | 内容区域背景 |

### 2.3 渐变色彩规范
```css
/* 主要渐变 */
--gradient-primary: linear-gradient(135deg, #00ffff, #0080ff);
--gradient-secondary: linear-gradient(135deg, #ff00ff, #ff0080);
--gradient-accent: linear-gradient(135deg, #00ff41, #00cc33);

/* 背景渐变 */
--gradient-bg: radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
```

## 3. 字体系统

### 3.1 字体家族
```css
/* 字体变量 */
--font-primary: 'Orbitron', 'Arial', sans-serif;          /* 主标题字体 */
--font-secondary: 'Rajdhani', 'Microsoft YaHei', sans-serif;  /* 正文字体 */
--font-mono: 'Courier New', monospace;                    /* 代码字体 */
--font-fallback: 'Arial', 'Microsoft YaHei', sans-serif;  /* 后备字体 */
```

### 3.2 字体尺寸规范
```css
/* 标题尺寸 */
--text-size-h1: clamp(2rem, 5vw, 4rem);        /* 32px - 64px */
--text-size-h2: clamp(1.5rem, 4vw, 3rem);     /* 24px - 48px */
--text-size-h3: clamp(1.25rem, 3vw, 2rem);    /* 20px - 32px */
--text-size-h4: clamp(1rem, 2vw, 1.5rem);     /* 16px - 24px */

/* 正文字体 */
--text-size-large: 1.125rem;                 /* 18px */
--text-size-normal: 1rem;                     /* 16px */
--text-size-small: 0.875rem;                  /* 14px */
--text-size-tiny: 0.75rem;                    /* 12px */
```

### 3.3 字重规范
```css
--font-weight-light: 300;      /* 轻量 */
--font-weight-normal: 400;     /* 正常 */
--font-weight-medium: 500;     /* 中等 */
--font-weight-semibold: 600;   /* 半粗 */
--font-weight-bold: 700;       /* 粗体 */
--font-weight-black: 900;      /* 超粗 */
```

### 3.4 行高规范
```css
--line-height-tight: 1.2;      /* 标题 */
--line-height-normal: 1.6;     /* 正文 */
--line-height-relaxed: 1.8;    /* 描述文本 */
```

## 4. 间距系统

### 4.1 基础间距单位
```css
--spacing-unit: 8px;           /* 基础单位 */
--spacing-xs: calc(var(--spacing-unit) * 0.5);    /* 4px */
--spacing-sm: calc(var(--spacing-unit) * 1);      /* 8px */
--spacing-md: calc(var(--spacing-unit) * 1.5);    /* 12px */
--spacing-lg: calc(var(--spacing-unit) * 2);      /* 16px */
--spacing-xl: calc(var(--spacing-unit) * 3);      /* 24px */
--spacing-2xl: calc(var(--spacing-unit) * 4);    /* 32px */
--spacing-3xl: calc(var(--spacing-unit) * 6);    /* 48px */
--spacing-4xl: calc(var(--spacing-unit) * 8);    /* 64px */
```

### 4.2 组件间距规范
- **组件内边距**: var(--spacing-md) var(--spacing-lg)
- **组件外边距**: var(--spacing-lg)
- **页面内边距**: var(--spacing-xl)
- **列表项间距**: var(--spacing-md)

## 5. 边框和圆角

### 5.1 边框规范
```css
--border-width: 1px;
--border-width-thick: 2px;

/* 边框样式 */
--border-style: solid;
--border-style-dashed: dashed;

/* 边框颜色 */
--border-color: var(--cyber-primary);
--border-color-secondary: var(--cyber-secondary);
--border-color-accent: var(--cyber-accent);
```

### 5.2 圆角规范
```css
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-xl: 16px;
--border-radius-full: 50%;
```

## 6. 阴影和发光效果

### 6.1 阴影系统
```css
/* 基础阴影 */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.6);

/* 霓虹发光效果 */
--cyber-glow: 0 0 20px currentColor;
--cyber-glow-strong: 0 0 30px currentColor;
--cyber-glow-pulse: 0 0 40px currentColor;
```

### 6.2 发光色彩
```css
/* 不同颜色的发光效果 */
--glow-primary: 0 0 20px rgba(0, 255, 255, 0.5);
--glow-secondary: 0 0 20px rgba(255, 0, 255, 0.5);
--glow-accent: 0 0 20px rgba(0, 255, 65, 0.5);
--glow-warning: 0 0 20px rgba(255, 255, 0, 0.5);
--glow-danger: 0 0 20px rgba(255, 7, 58, 0.5);
```

## 7. 动画系统

### 7.1 动画时长规范
```css
--animation-fast: 0.2s;        /* 快速动画 */
--animation-normal: 0.3s;     /* 正常动画 */
--animation-slow: 0.5s;       /* 慢速动画 */
--animation-extra-slow: 1s;    /* 超慢动画 */
```

### 7.2 缓动函数
```css
/* 缓动函数 */
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
--bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 7.3 核心动画库
```css
/* 淡入动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 滑入动画 */
@keyframes slideInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* 发光脉冲 */
@keyframes glowPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

/* 背景脉冲 */
@keyframes backgroundPulse {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 扫描线效果 */
@keyframes scanLine {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

/* 数据流动 */
@keyframes dataFlow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## 8. 布局系统

### 8.1 响应式断点
```css
/* 断点定义 */
--breakpoint-mobile: 320px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-large: 1440px;

/* 媒体查询 */
@media (max-width: 767px) { /* 移动端 */ }
@media (min-width: 768px) and (max-width: 1023px) { /* 平板端 */ }
@media (min-width: 1024px) { /* 桌面端 */ }
```

### 8.2 网格系统
```css
/* 网格布局 */
.grid {
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* 网格背景 */
.cyber-grid {
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 10s linear infinite;
}
```

### 8.3 容器系统
```css
/* 容器宽度 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* 响应式容器 */
.container-sm { max-width: 800px; }
.container-md { max-width: 1000px; }
.container-lg { max-width: 1400px; }
```

## 9. 组件设计规范

### 9.1 按钮组件
```css
/* 按钮基础样式 */
.cyber-btn {
  padding: var(--spacing-md) var(--spacing-xl);
  border: var(--border-width) solid var(--cyber-primary);
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--cyber-primary);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all var(--animation-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

/* 按钮状态 */
.cyber-btn:hover {
  box-shadow: var(--glow-primary);
  transform: translateY(-2px);
}

.cyber-btn:active {
  transform: translateY(0);
}

/* 按钮变体 */
.cyber-btn-primary { border-color: var(--cyber-primary); color: var(--cyber-primary); }
.cyber-btn-secondary { border-color: var(--cyber-secondary); color: var(--cyber-secondary); }
.cyber-btn-accent { border-color: var(--cyber-accent); color: var(--cyber-accent); }
.cyber-btn-warning { border-color: var(--cyber-warning); color: var(--cyber-warning); }
.cyber-btn-danger { border-color: var(--cyber-danger); color: var(--cyber-danger); }
```

### 9.2 卡片组件
```css
/* 卡片基础样式 */
.cyber-card {
  background: var(--cyber-light);
  border: var(--border-width) solid var(--cyber-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
}

/* 全息效果 */
.cyber-card.hologram::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(0, 255, 255, 0.1) 50%, 
    transparent 70%);
  animation: hologramShimmer 3s infinite;
}
```

### 9.3 表单组件
```css
/* 输入框样式 */
.cyber-input {
  width: 100%;
  padding: var(--spacing-md);
  background: var(--cyber-darker);
  border: var(--border-width) solid var(--cyber-primary);
  border-radius: var(--border-radius-md);
  color: var(--cyber-text);
  font-family: var(--font-secondary);
  transition: all var(--animation-normal) var(--ease-out);
}

.cyber-input:focus {
  outline: none;
  box-shadow: var(--glow-primary);
  border-color: var(--cyber-accent);
}

/* 选择框样式 */
.cyber-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2300ffff' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--spacing-md) center;
  padding-right: var(--spacing-2xl);
}
```

### 9.4 导航组件
```css
/* 导航基础样式 */
.cyber-nav {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--cyber-light);
  border-radius: var(--border-radius-lg);
  border: var(--border-width) solid var(--cyber-primary);
}

/* 导航项目 */
.cyber-nav-item {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  color: var(--cyber-text);
  text-decoration: none;
  transition: all var(--animation-normal) var(--ease-out);
}

.cyber-nav-item:hover,
.cyber-nav-item.active {
  background: var(--cyber-primary);
  color: var(--cyber-dark);
}
```

## 10. 特殊效果

### 10.1 背景效果
```css
/* 扫描线效果 */
.scan-lines::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 255, 255, 0.03) 50%
  );
  background-size: 100% 4px;
  animation: scanLines 8s linear infinite;
  pointer-events: none;
  z-index: 1;
}

/* 粒子背景 */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--cyber-primary);
  border-radius: 50%;
  animation: float 10s infinite linear;
}
```

### 10.2 数据流动效果
```css
/* 数据流 */
.data-stream {
  position: relative;
  overflow: hidden;
}

.data-stream::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent,
    rgba(0, 255, 255, 0.4),
    transparent
  );
  animation: dataFlow 3s infinite;
}
```

### 10.3 故障效果
```css
/* 故障艺术效果 */
.glitch {
  position: relative;
  animation: glitch 2s infinite;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  animation: glitch-1 0.5s infinite;
  color: var(--cyber-primary);
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 0.5s infinite;
  color: var(--cyber-secondary);
  z-index: -2;
}
```

## 11. 页面特定设计

### 11.1 主页设计
- **布局**: 垂直布局，顶部标题，中间二维码，底部排行榜
- **特色**: 动态网格背景，脉冲动画，实时数据更新
- **交互**: 二维码自动生成，实时状态显示

### 11.2 答题页面设计
- **布局**: 简洁居中布局，大按钮设计
- **特色**: 倒计时进度条，状态指示器
- **交互**: 触摸优化，防重复提交

### 11.3 管理员面板设计
- **布局**: 网格布局，多列显示
- **特色**: 实时监控，权限管理，系统控制
- **交互**: 复杂表单，实时数据操作

### 11.4 排行榜页面设计
- **布局**: 突出显示前三名，完整排名列表
- **特色**: 领奖台设计，动态更新，全屏支持
- **交互**: 自动刷新，键盘快捷键

## 12. 性能优化

### 12.1 CSS优化
- 使用CSS变量便于主题管理
- 使用transform和opacity进行动画
- 避免过多的重绘和重排
- 使用will-change提示浏览器优化

### 12.2 图片优化
- 使用WebP格式图片
- 图片懒加载
- 响应式图片
- CSS动画代替GIF

### 12.3 字体优化
- 字体预加载
- 字体显示策略
- 系统字体后备
- 字体子集化

## 13. 浏览器兼容性

### 13.1 支持的浏览器
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

### 13.2 渐进增强
- 基础功能在所有浏览器中可用
- 高级效果在现代浏览器中显示
- 优雅降级处理
- 功能检测而非浏览器检测

## 14. 无障碍设计

### 14.1 色彩对比度
- 主要文本对比度 > 4.5:1
- 大文本对比度 > 3:1
- 非文本元素对比度 > 3:1

### 14.2 键盘导航
- 完整的键盘tab顺序
- 焦点状态可见
- 快捷键支持
- 跳过导航链接

### 14.3 屏幕阅读器
- 语义化HTML结构
- ARIA标签支持
- 替代文本
- 清晰的页面标题

## 15. 维护和扩展

### 15.1 设计令牌
- 所有设计值都使用CSS变量
- 便于主题切换和品牌调整
- 统一的设计系统
- 易于维护和更新

### 15.2 组件库
- 可重用的组件设计
- 统一的API设计
- 文档齐全
- 版本管理

### 15.3 设计规范维护
- 定期审查和更新
- 用户反馈收集
- 性能监控
- 新技术评估

## 16. 成就系统设计规范

### 16.1 成就系统设计理念
**游戏化 + 赛博朋克美学** - 将游戏化的成就系统与赛博朋克视觉风格完美融合，创造令人兴奋的用户体验。

### 16.2 成就等级色彩系统

#### 16.2.1 成就等级色彩定义
```css
/* 成就等级色彩 */
--achievement-bronze: #cd7f32;     /* 青铜色 */
--achievement-silver: #c0c0c0;     /* 银色 */
--achievement-gold: #ffd700;       /* 金色 */
--achievement-platinum: #e5e4e2;   /* 铂金色 */
--achievement-diamond: #b9f2ff;     /* 钻石色 */

/* 成就发光效果 */
--glow-bronze: 0 0 20px rgba(205, 127, 50, 0.6);
--glow-silver: 0 0 20px rgba(192, 192, 192, 0.8);
--glow-gold: 0 0 30px rgba(255, 215, 0, 0.8);
--glow-platinum: 0 0 25px rgba(229, 228, 226, 0.9);
--glow-diamond: 0 0 40px rgba(185, 242, 255, 0.9);
```

#### 16.2.2 成就等级色彩应用
| 等级 | 色彩值 | 发光强度 | 视觉感受 | 使用场景 |
|------|--------|----------|----------|----------|
| 青铜 | #cd7f32 | 中等 | 温暖、稳重 | 初级成就 |
| 银色 | #c0c0c0 | 较强 | 清新、优雅 | 中级成就 |
| 金色 | #ffd700 | 强烈 | 华丽、珍贵 | 高级成就 |
| 铂金 | #e5e4e2 | 很强 | 高贵、稀有 | 专家成就 |
| 钻石 | #b9f2ff | 极强 | 神圣、传奇 | 大师成就 |

### 16.3 成就组件设计

#### 16.3.1 成就卡片组件
```css
.achievement-card {
  background: var(--cyber-light);
  border: 2px solid var(--cyber-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  transition: all var(--animation-normal) var(--ease-out);
  cursor: pointer;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--glow-primary);
}

.achievement-card.unlocked {
  border-color: var(--achievement-gold);
  box-shadow: var(--glow-gold);
}

.achievement-card.bronze { 
  border-color: var(--achievement-bronze); 
  box-shadow: var(--glow-bronze);
}
.achievement-card.silver { 
  border-color: var(--achievement-silver); 
  box-shadow: var(--glow-silver);
}
.achievement-card.gold { 
  border-color: var(--achievement-gold); 
  box-shadow: var(--glow-gold);
}
.achievement-card.platinum { 
  border-color: var(--achievement-platinum); 
  box-shadow: var(--glow-platinum);
}
.achievement-card.diamond { 
  border-color: var(--achievement-diamond); 
  box-shadow: var(--glow-diamond);
}
```

#### 16.3.2 成就徽章设计
```css
.achievement-badge {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  position: relative;
  background: var(--cyber-darker);
  border: 3px solid var(--achievement-bronze);
  transition: all var(--animation-normal) var(--ease-out);
}

.achievement-badge.unlocked {
  animation: achievementUnlock 1s var(--bounce);
}

.achievement-badge::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: inherit;
  filter: blur(10px);
  opacity: 0.6;
  z-index: -1;
}

.achievement-badge.bronze { border-color: var(--achievement-bronze); }
.achievement-badge.silver { border-color: var(--achievement-silver); }
.achievement-badge.gold { border-color: var(--achievement-gold); }
.achievement-badge.platinum { border-color: var(--achievement-platinum); }
.achievement-badge.diamond { border-color: var(--achievement-diamond); }
```

#### 16.3.3 成就进度条设计
```css
.achievement-progress {
  width: 100%;
  height: 8px;
  background: var(--cyber-darker);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  position: relative;
  margin: var(--spacing-md) 0;
}

.achievement-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--cyber-primary), var(--cyber-accent));
  border-radius: var(--border-radius-full);
  transition: width var(--animation-normal) var(--ease-out);
  position: relative;
}

.achievement-progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 2s infinite;
}

.achievement-progress-text {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-size-small);
  color: var(--cyber-text-dim);
  margin-top: var(--spacing-sm);
}
```

#### 16.3.4 成就统计组件
```css
.achievement-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.achievement-stat-card {
  background: var(--cyber-light);
  border: 1px solid var(--cyber-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.achievement-stat-number {
  font-size: var(--text-size-h3);
  font-weight: var(--font-weight-bold);
  color: var(--cyber-primary);
  margin-bottom: var(--spacing-sm);
}

.achievement-stat-label {
  font-size: var(--text-size-small);
  color: var(--cyber-text-dim);
  text-transform: uppercase;
  letter-spacing: 1px;
}
```

### 16.4 成就页面布局设计

#### 16.4.1 成就主页面布局
```css
.achievement-page {
  min-height: 100vh;
  background: var(--cyber-dark);
  padding: var(--spacing-xl);
  position: relative;
}

.achievement-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  position: relative;
}

.achievement-title {
  font-size: var(--text-size-h1);
  color: var(--cyber-primary);
  margin-bottom: var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: var(--font-weight-black);
}

.achievement-subtitle {
  font-size: var(--text-size-large);
  color: var(--cyber-text-dim);
  margin-bottom: var(--spacing-xl);
}

.achievement-categories {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  flex-wrap: wrap;
}

.achievement-category {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--cyber-light);
  border: 1px solid var(--cyber-primary);
  border-radius: var(--border-radius-full);
  color: var(--cyber-text);
  text-decoration: none;
  transition: all var(--animation-normal) var(--ease-out);
  cursor: pointer;
}

.achievement-category:hover,
.achievement-category.active {
  background: var(--cyber-primary);
  color: var(--cyber-dark);
  box-shadow: var(--glow-primary);
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}
```

#### 16.4.2 成就详情页面布局
```css
.achievement-detail {
  max-width: 800px;
  margin: 0 auto;
  background: var(--cyber-light);
  border-radius: var(--border-radius-lg);
  border: 2px solid var(--cyber-primary);
  overflow: hidden;
  position: relative;
}

.achievement-detail-header {
  background: linear-gradient(135deg, var(--cyber-primary), var(--cyber-secondary));
  padding: var(--spacing-2xl);
  text-align: center;
  position: relative;
}

.achievement-detail-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-lg);
  background: var(--cyber-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 4px solid var(--achievement-gold);
  box-shadow: var(--glow-gold);
}

.achievement-detail-content {
  padding: var(--spacing-2xl);
}

.achievement-detail-description {
  font-size: var(--text-size-large);
  color: var(--cyber-text);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-xl);
}

.achievement-detail-requirements {
  background: var(--cyber-darker);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.achievement-detail-rewards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}
```

### 16.5 成就动画效果

#### 16.5.1 成就解锁动画
```css
@keyframes achievementUnlock {
  0% { 
    transform: scale(0) rotate(0deg); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1.2) rotate(180deg); 
    opacity: 1; 
  }
  100% { 
    transform: scale(1) rotate(360deg); 
    opacity: 1; 
  }
}

@keyframes achievementGlow {
  0%, 100% { 
    box-shadow: var(--glow-gold); 
  }
  50% { 
    box-shadow: var(--glow-gold), 0 0 60px rgba(255, 215, 0, 0.8); 
  }
}

@keyframes achievementFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes achievementSparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}
```

#### 16.5.2 进度条动画
```css
@keyframes progressFill {
  from { width: 0%; }
  to { width: var(--progress-percent); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes progressGlow {
  0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 65, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.8); }
}
```

#### 16.5.3 成就通知动画
```css
.achievement-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--cyber-light);
  border: 2px solid var(--achievement-gold);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  min-width: 300px;
  z-index: 1000;
  animation: slideInRight var(--animation-normal) var(--ease-out);
}

@keyframes slideInRight {
  from { 
    transform: translateX(100%); 
    opacity: 0; 
  }
  to { 
    transform: translateX(0); 
    opacity: 1; 
  }
}

@keyframes slideOutRight {
  from { 
    transform: translateX(0); 
    opacity: 1; 
  }
  to { 
    transform: translateX(100%); 
    opacity: 0; 
  }
}
```

### 16.6 成就分享设计

#### 16.6.1 成就分享卡片
```css
.achievement-share-card {
  width: 400px;
  height: 200px;
  background: linear-gradient(135deg, var(--cyber-light), var(--cyber-darker));
  border-radius: var(--border-radius-lg);
  border: 2px solid var(--achievement-gold);
  padding: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}

.achievement-share-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    transparent,
    rgba(255, 215, 0, 0.3),
    transparent,
    rgba(0, 255, 255, 0.3),
    transparent
  );
  animation: rotate 3s linear infinite;
}

.achievement-share-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  position: relative;
  z-index: 1;
}

.achievement-share-title {
  font-size: var(--text-size-h3);
  color: var(--cyber-primary);
  font-weight: var(--font-weight-bold);
}

.achievement-share-badge {
  width: 60px;
  height: 60px;
  background: var(--cyber-darker);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid var(--achievement-gold);
}

.achievement-share-description {
  font-size: var(--text-size-normal);
  color: var(--cyber-text);
  margin-bottom: var(--spacing-lg);
  position: relative;
  z-index: 1;
}

.achievement-share-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.achievement-share-player {
  font-size: var(--text-size-small);
  color: var(--cyber-text-dim);
}

.achievement-share-date {
  font-size: var(--text-size-small);
  color: var(--cyber-text-dim);
}
```

#### 16.6.2 分享按钮设计
```css
.achievement-share-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-lg);
}

.achievement-share-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--cyber-primary);
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--cyber-dark);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all var(--animation-normal) var(--ease-out);
}

.achievement-share-btn:hover {
  background: var(--cyber-secondary);
  box-shadow: var(--glow-secondary);
  transform: translateY(-2px);
}
```

### 16.7 成就图标设计

#### 16.7.1 成就类型图标
```css
.achievement-icon-answer::before {
  content: "📝";
}

.achievement-icon-streak::before {
  content: "🔥";
}

.achievement-icon-speed::before {
  content: "⚡";
}

.achievement-icon-accuracy::before {
  content: "🎯";
}

.achievement-icon-theme::before {
  content: "🏆";
}
```

#### 16.7.2 成就等级图标
```css
.achievement-icon-bronze::before {
  content: "🥉";
}

.achievement-icon-silver::before {
  content: "🥈";
}

.achievement-icon-gold::before {
  content: "🥇";
}

.achievement-icon-platinum::before {
  content: "💎";
}

.achievement-icon-diamond::before {
  content: "👑";
}
```

### 16.8 响应式设计

#### 16.8.1 移动端适配
```css
@media (max-width: 767px) {
  .achievement-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-stats {
    grid-template-columns: 1fr;
  }
  
  .achievement-categories {
    flex-direction: column;
    align-items: center;
  }
  
  .achievement-share-card {
    width: 100%;
    max-width: 350px;
  }
}
```

#### 16.8.2 平板端适配
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .achievement-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .achievement-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 16.9 性能优化

#### 16.9.1 动画性能优化
```css
.achievement-card {
  will-change: transform, box-shadow;
}

.achievement-badge {
  will-change: transform;
}

.achievement-progress-bar {
  will-change: width;
}
```

#### 16.9.2 图片优化
```css
.achievement-icon {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
```

---

**文档版本**: v3.0  
**创建日期**: 2025年8月3日  
**最后更新**: 2025年8月3日  
**状态**: 已完成 (包含成就系统设计规范)  
**审核状态**: 待审核  

🤖 Generated with [Claude Code](https://claude.ai/code)