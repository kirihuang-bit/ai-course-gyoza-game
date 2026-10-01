#!/bin/bash
# 一鍵啟動(macOS):雙擊這個檔,就會打開 GYOZA WOOD 鍋貼店經營遊戲。
# 第一次使用若被系統擋下:對檔案按右鍵 → 打開。或在終端機執行:bash start-m11.command
cd "$(dirname "$0")/web-lab" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "[!] 找不到 Node.js,請先到 https://nodejs.org 安裝 LTS 版,裝好後再執行一次。"
  read -n 1 -s -r -p "按任意鍵關閉..."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "第一次啟動,安裝套件中(約 1-2 分鐘,只需要做這一次)..."
  if ! npm install; then
    echo "[!] npm install 失敗,請把這個視窗截圖給老師。"
    read -n 1 -s -r -p "按任意鍵關閉..."
    exit 1
  fi
fi

echo "啟動中,瀏覽器會自動打開 http://localhost:5180 ..."
npm run dev -- --open
