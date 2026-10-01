import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 這個專案沒有後端：遊戲完全在瀏覽器裡跑，不存檔、不寫檔案。
// 這裡只設定 React 與固定的網址門牌 5180。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
  },
});
