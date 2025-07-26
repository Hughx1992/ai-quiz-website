#!/bin/bash

# AI答题竞赛网站部署脚本
# 使用方法: ./deploy.sh [环境] [选项]
# 环境: dev (开发) | prod (生产)
# 选项: --init (初始化) | --restart (重启) | --stop (停止)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
APP_NAME="ai-quiz-website"
APP_DIR="/opt/ai-quiz-website"
SERVICE_NAME="ai-quiz"
PORT=3000

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查系统要求
check_requirements() {
    log_info "检查系统要求..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js 14.0 或更高版本"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    log_info "Node.js 版本: $NODE_VERSION"
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    NPM_VERSION=$(npm -v)
    log_info "npm 版本: $NPM_VERSION"
    
    # 检查PM2 (生产环境)
    if [ "$1" = "prod" ]; then
        if ! command -v pm2 &> /dev/null; then
            log_warning "PM2 未安装，正在安装..."
            npm install -g pm2
        fi
        PM2_VERSION=$(pm2 -v)
        log_info "PM2 版本: $PM2_VERSION"
    fi
    
    log_success "系统要求检查完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    
    if [ -f "package.json" ]; then
        npm install
        log_success "依赖安装完成"
    else
        log_error "package.json 文件不存在"
        exit 1
    fi
}

# 初始化数据
init_data() {
    log_info "初始化数据..."
    
    if [ -f "server/init-data.js" ]; then
        node server/init-data.js
        log_success "数据初始化完成"
    else
        log_error "初始化脚本不存在"
        exit 1
    fi
}

# 运行测试
run_tests() {
    log_info "运行系统测试..."
    
    if [ -f "test-system.js" ]; then
        node test-system.js
        log_success "系统测试完成"
    else
        log_warning "测试脚本不存在，跳过测试"
    fi
}

# 开发环境部署
deploy_dev() {
    log_info "部署到开发环境..."
    
    check_requirements "dev"
    install_dependencies
    
    if [ "$1" = "--init" ]; then
        init_data
    fi
    
    log_info "启动开发服务器..."
    npm start
}

# 生产环境部署
deploy_prod() {
    log_info "部署到生产环境..."
    
    check_requirements "prod"
    install_dependencies
    
    if [ "$1" = "--init" ]; then
        init_data
    fi
    
    # 运行测试
    run_tests
    
    # 使用PM2启动服务
    log_info "使用PM2启动服务..."
    
    # 停止现有服务（如果存在）
    pm2 stop $SERVICE_NAME 2>/dev/null || true
    pm2 delete $SERVICE_NAME 2>/dev/null || true
    
    # 启动新服务
    pm2 start server/app.js --name $SERVICE_NAME --instances 1
    pm2 save
    
    log_success "生产环境部署完成"
    log_info "服务状态:"
    pm2 status
}

# 重启服务
restart_service() {
    log_info "重启服务..."
    
    if command -v pm2 &> /dev/null; then
        pm2 restart $SERVICE_NAME
        log_success "服务重启完成"
    else
        log_warning "PM2 未安装，请手动重启服务"
    fi
}

# 停止服务
stop_service() {
    log_info "停止服务..."
    
    if command -v pm2 &> /dev/null; then
        pm2 stop $SERVICE_NAME
        log_success "服务已停止"
    else
        log_warning "PM2 未安装，请手动停止服务"
    fi
}

# 创建系统服务 (Linux)
create_systemd_service() {
    log_info "创建系统服务..."
    
    cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=AI Quiz Website
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server/app.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=$PORT

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable $SERVICE_NAME
    systemctl start $SERVICE_NAME
    
    log_success "系统服务创建完成"
}

# 备份数据
backup_data() {
    log_info "备份数据..."
    
    BACKUP_DIR="backup/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    if [ -d "database" ]; then
        cp -r database $BACKUP_DIR/
        log_success "数据备份完成: $BACKUP_DIR"
    else
        log_warning "数据目录不存在"
    fi
}

# 显示帮助信息
show_help() {
    echo "AI答题竞赛网站部署脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 <环境> [选项]"
    echo ""
    echo "环境:"
    echo "  dev     开发环境部署"
    echo "  prod    生产环境部署"
    echo ""
    echo "选项:"
    echo "  --init     初始化数据"
    echo "  --restart  重启服务"
    echo "  --stop     停止服务"
    echo "  --backup   备份数据"
    echo "  --help     显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 dev --init          # 开发环境初始化部署"
    echo "  $0 prod                # 生产环境部署"
    echo "  $0 prod --restart      # 重启生产环境服务"
    echo "  $0 prod --backup       # 备份数据"
}

# 主函数
main() {
    echo "🚀 AI答题竞赛网站部署脚本"
    echo "================================"
    
    case "$1" in
        "dev")
            deploy_dev "$2"
            ;;
        "prod")
            case "$2" in
                "--restart")
                    restart_service
                    ;;
                "--stop")
                    stop_service
                    ;;
                "--backup")
                    backup_data
                    ;;
                *)
                    deploy_prod "$2"
                    ;;
            esac
            ;;
        "--help"|"-h"|"")
            show_help
            ;;
        *)
            log_error "未知参数: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
