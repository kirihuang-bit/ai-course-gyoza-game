@echo off
chcp 65001 >nul
rem 一鍵啟動:雙擊這個檔,就會打開 GYOZA WOOD 鍋貼店經營遊戲。
cd /d "%~dp0web-lab"

where node >nul 2>nul
if errorlevel 1 goto no_node

if exist node_modules goto start_dev

echo 第一次啟動,安裝套件中,約 1-2 分鐘,只需要做這一次...
call npm install
if errorlevel 1 goto install_failed

:start_dev
echo 啟動中,瀏覽器會自動打開 http://localhost:5180 ...
call npm run dev -- --open
pause
exit /b 0

:no_node
echo [!] 找不到 Node.js,請先到 https://nodejs.org 安裝 LTS 版,裝好後再雙擊一次。
pause
exit /b 1

:install_failed
echo [!] npm install 失敗,請把這個視窗截圖給老師。
pause
exit /b 1
