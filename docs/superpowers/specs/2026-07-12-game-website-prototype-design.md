# 遊戲公司官網＋DEMO 大廳 原型網站 設計規格

日期:2026-07-12
狀態:待 Cooper 確認
用途:內部展示/提案用原型,未來將直接演化為正式官網

## 1. 目標與範圍

建立一個綜合型網站原型,包含:

1. 公司官網:簡介、特色、時間軸、聯絡方式
2. 遊戲 DEMO 大廳:三大類(老虎機、棋牌、迷你遊戲)遊戲展示,類別可擴充
3. 遊戲專屬頁:iframe 嵌入 DEMO(原型階段為佔位畫面)+ 示意圖 + 玩法規格
4. 開發用調色工具:即時調整全站主色/輔色

### 不在範圍內
- 真實遊戲 DEMO 串接(demoUrl 欄位已預留,接上即用)
- 多語系(全站繁體中文)
- 後端/CMS(資料以 TypeScript 檔管理)
- 聯絡表單實際送出功能(原型僅展示 UI)

## 2. 已確認的需求決策

| 項目 | 決策 |
|---|---|
| 目標受眾 | 內部展示/提案用 |
| 語言 | 繁體中文 |
| 技術棧 | Next.js(App Router)+ TypeScript + Tailwind CSS + Framer Motion |
| DEMO 來源 | 原型階段全部用佔位畫面 |
| 遊戲清單 | Cooper 提供真實清單(名稱、類別、狀態);圖示先用佔位圖 |
| 文案 | 先用示意文案,之後換真實內容 |
| 網站架構 | 單頁滾動首頁 + 各區塊「看全部」進入完整頁 |
| 滾動手感 | 混搭:Hero 滿版吸附 + 內容區自由滾動進場動畫 |
| 調色功能 | color picker 自由調 + 預設主題切換 + localStorage 記憶 |
| 響應式 | 電腦優先,手機基本 RWD 不破版,動畫以桌機為準 |

## 3. 路由結構

```
/                        首頁(滿版滾動總覽)
/about                   公司簡介完整頁
/features                公司特色完整頁
/timeline                公司時間軸完整頁
/contact                 聯絡我們完整頁
/games                   遊戲總覽(類別入口;新增遊戲類別由此擴充)
/games/[category]        類別大廳:該類全部遊戲圖示牆(開發中+已上線)
/games/[category]/[slug] 遊戲專屬頁:iframe DEMO + 示意圖 + 玩法規格
```

## 4. 首頁設計(混搭滾動)

- **第一屏 Hero**:滿版主視覺,CSS `scroll-snap` 吸附
- **內容區**(自由滾動,Framer Motion `whileInView` 進場動畫),依序:
  1. 公司簡介
  2. 公司特色
  3. 公司時間軸
  4. 遊戲精選(三類代表作)
  5. 聯絡我們
- 每個區塊右下角「看全部 →」按鈕,切換至對應完整頁
- 導覽列:區塊錨點 + 完整頁連結,捲動時高亮當前區塊
- 動畫尊重 `prefers-reduced-motion`

## 5. 遊戲資料模型

```ts
// src/data/categories.ts — 類別獨立定義,新增類別只改這裡
type Category = {
  slug: string            // 'slots' | 'card' | 'mini' ...
  name: string            // 老虎機 / 棋牌 / 迷你遊戲
  description: string
}

// src/data/games.ts
type Game = {
  slug: string
  name: string
  category: string        // 對應 Category.slug
  status: 'live' | 'dev'  // 已上線 / 開發中
  thumbnail: string       // 缺圖時自動用預設佔位圖
  screenshots: string[]
  specs: {
    reels?: string        // 老虎機:轉軸
    lines?: string        // 老虎機:線數
    rtp?: string          // 標示用途;原型階段為示意值,非經驗證數據
    features: string[]    // 玩法特色
  }
  demoUrl?: string        // 未提供時遊戲頁顯示「DEMO 即將推出」佔位畫面
}
```

> 注意:specs 中 rtp 等數值在原型階段皆為示意文案,不代表實際遊戲數值;
> 正式版填入真實數據前需經數值驗證流程。

## 6. 開發用調色系統

- **入口**:右下角浮動齒輪鈕(`position: fixed`,全站可見)
- **彈窗內容**:
  - 主色 / 輔色 color picker,調整即時生效
  - 4~5 組預設主題一鍵切換
  - 重置鈕(還原預設)
- **實作**:
  - 全站顏色一律走 CSS variables:`--primary`、`--secondary` 及自動衍生深淺階(hover、背景、邊框等)
  - 衍生邏輯(色彩深淺計算)為純函式,寫單元測試
  - 使用者選擇存 localStorage,重整後保留

## 7. 邊界處理

| 情境 | 行為 |
|---|---|
| 遊戲無 demoUrl | iframe 區顯示「DEMO 即將推出」佔位畫面 |
| 遊戲無縮圖 | 顯示預設佔位圖(含遊戲名稱) |
| 類別下無遊戲 | 顯示「即將推出」空狀態 |
| 使用者停用動畫 | `prefers-reduced-motion` 時關閉進場動畫與吸附 |
| 手機瀏覽 | 基本 RWD:單欄排版、不破版即可,不特別精修 |

## 8. 測試與驗收

- 基線:`tsc` type-check 通過、`next build` 成功、lint 無錯誤
- 單元測試:調色系統的顏色衍生純函式
- 驗收:瀏覽器實走全部動線 —— 首頁滾動動畫 → 各「看全部」頁 →
  遊戲總覽 → 三類別大廳 → 遊戲頁佔位 DEMO → 調色彈窗即時變色與
  localStorage 記憶
- 驗收由 fresh-context agent 執行(依全域守則,不自驗)

## 9. 待 Cooper 提供

- 真實遊戲清單:每款遊戲的「名稱、類別、狀態(開發中/已上線)」
  (提供前先用示意清單開發,資料集中於 src/data/games.ts,直接替換)

## 10. 已討論並放棄的方案

| 方案 | 放棄理由 |
|---|---|
| 架構 A:類別即主導覽(扁平式) | Cooper 偏好單頁滾動的沉浸式首頁呈現 |
| 架構 B:官網＋大廳雙區 | 同上 |
| 純吸附滾動(全站整屏切換) | 內容區自由滾動較順,採混搭 |
| 純靜態 HTML / Vite+React | Cooper 決定原型直接演化為正式官網,採 Next.js |
| 純 CSS 動畫(零依賴) | 原型需快速做出高質感動畫,採 Framer Motion |
| 中英雙語 | 內部展示用,繁中即可 |
