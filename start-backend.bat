@echo off
REM 启动后端服务脚本

REM 检查Node.js是否安装
node -v > nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js。请先安装Node.js。
    pause
    exit /b 1
)

REM 切换到后端目录
echo 切换到后端目录...
cd src\backend

REM 安装必要的依赖（如果尚未安装）
echo 正在安装依赖...
npm install express mysql2 bcryptjs cors dotenv

REM 启动后端服务
echo 正在启动后端服务...
node server.js

pause