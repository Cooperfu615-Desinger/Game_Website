# 大廳架構:官網區／遊戲大廳區分離(route groups)

## 背景

Cooper 要求遊戲大廳(老虎機/棋牌/迷你遊戲三個大廳頁)換一套跟官網不同的導覽列(登入/聯絡我們/客服/官網/語系),並新增 Banner、類別切換鈕、篩選列。原本全站只有一套 `Navbar`(公司簡介/特色/時間軸/遊戲/聯絡我們),套用在所有頁面上。

## 決策

### 用 Next.js route group 拆分,不是拆成兩個獨立網站

```
src/app/
  layout.tsx              根 layout,只留 ThemeProvider/Footer/DevColorPanel,不含任何 Navbar
  (site)/                 官網區,layout.tsx 掛 <Navbar/>
    page.tsx / about / features / timeline / contact / games/page.tsx
  (lobby)/                大廳區,layout.tsx 掛 <LobbyNavbar/>
    games/[category]/
      layout.tsx           Banner + CategoryTabs,大廳頁與單一遊戲頁共用這層
      page.tsx / [slug]/page.tsx
```

`(site)`、`(lobby)` 資料夾名稱加括號是 Next.js 的 route group 語法,**不會出現在網址上**,純粹是檔案組織方式。`/games`(來自 `(site)/games/page.tsx`)與 `/games/slots`(來自 `(lobby)/games/[category]/page.tsx`)雖然都在 `games` 這個路徑底下,但因為是不同資料夾層級的不同路由(前者是精確匹配 `/games`,後者是 `/games/[category]` 動態匹配),兩者共存不衝突——這是 Next.js 官方支援的模式(常見於行銷網站+應用程式主體並存的架構),不是 hack。

### `/games`(遊戲總覽/選類別入口頁)刻意留在官網區,不套用大廳導覽

`/games` 的角色是「選擇要進哪個大廳」的選單頁,性質上更接近官網的一部分,不是大廳本身,所以維持官網 Navbar 不變。真正進入某個大廳(`/games/slots` 等)之後才切換成大廳導覽列。

### Banner 與 CategoryTabs 也套用在單一遊戲詳情頁

`(lobby)/games/[category]/layout.tsx` 同時包住大廳列表頁(`page.tsx`)跟單一遊戲詳情頁(`[slug]/page.tsx`),所以點進某一款遊戲的詳情頁,上方依然會看到 Banner 輪播跟三類切換鈕。**這是刻意的架構決定,不是疏漏**——品質審查曾經標示這個「浪費畫面空間、讓詳情頁不夠專注」為 Critical 問題,但 Cooper 確認過後選擇保留現狀,理由是維持大廳瀏覽體驗的一致性,真實的博弈平台也常見這種做法(進到單一遊戲的說明頁仍保留頂部 Banner 與分類導覽)。**如果之後想拿掉,只要幫 `[slug]/` 加一個自己的 pass-through layout.tsx,不渲染 Banner/Tabs 即可,不需要動到大廳列表頁的邏輯。**

### 新增的大廳專屬元件(`src/components/lobby/`)

| 元件 | 功能 | 備註 |
|---|---|---|
| `LobbyNavbar` | 大廳導覽列 | 登入/聯絡我們/客服/官網/語系 |
| `LoginModal` | 登入彈窗 | 帳號密碼輸入框,**純前端示意,不做真實驗證** |
| `ServicePanel` | 客服面板 | 右側滑出的簡易對話框,**純前端顯示,不接任何後端**,訊息送出後只是加進本地畫面的訊息串 |
| `LanguageDropdown` | 語系切換 | **純視覺選項(繁中/簡中/English),不做任何真實翻譯**,選了只換顯示文字 |
| `PromoBanner` | Banner 輪播 | 自動輪播(7 秒)+ 手動拖曳滑動,每個類別各自獨立的輪播內容(`src/data/banners.ts`) |
| `CategoryTabs` | 三類切換鈕 | 老虎機/棋牌/迷你遊戲互轉 |
| `GameFilterBar` | 篩選列 | 全部/新推出/熱門 + 排序(預設/名稱A-Z)+ 搜尋,client-side 篩選(靜態站無後端) |

### 資料模型新增 `isNew`/`isPopular`

`src/data/types.ts` 的 `Game` 型別加了 `isNew?: boolean`、`isPopular?: boolean`,供 `GameFilterBar` 的「新推出/熱門」分頁篩選使用。目前是人工挑選的示意標記(每個類別各標 1-2 款),不是真實營運資料。

## 過程中修正的無障礙問題(值得記住的教訓)

1. **`<header>` 不能巢狀在 `<main>` 裡**:根 layout 原本把 `<main>` 包在最外層,導致各 route group 自己的 `<Navbar>`/`<LobbyNavbar>` 都變成 `<main>` 的子元素,依 HTML5 規範會**遺失隱含的 `role="banner"` landmark**。修法:把 `<main>` 下放到各 route group 自己的 layout,根 layout 只留 `{children}`,讓 `<header>` 跟 `<main>` 維持 sibling 關係。
2. **彈窗/滑出面板要有基本 focus 管理**:`LoginModal`/`ServicePanel` 開啟時 focus 要移進去、關閉後要還原到觸發按鈕,並加 `role="dialog"` `aria-modal="true"`。
3. **關閉的面板不能只靠 `aria-hidden` 隱藏**:`ServicePanel` 一開始用「保持掛載 + `translate-x-full` 位移 + `aria-hidden`」做滑出動畫,但 `aria-hidden` 不會真的把裡面的 `<input>`/`<button>` 移出 Tab 順序,鍵盤使用者還是能 Tab 進畫面外看不到的欄位。改成「`open` 為 false 時整個不渲染」,滑入動畫改用純 CSS keyframe 達成(嘗試過 `framer-motion` 的 `AnimatePresence` 做退場動畫,但在這個專案的 React/framer-motion 版本組合下,exit 動畫視覺完成後 DOM 節點卻不會真的 unmount,已放棄改用更可靠的寫法)。
4. **自動輪播的 Banner 要有暫停機制**:符合 WCAG 2.2.2(Pause, Stop, Hide),`PromoBanner` 加了滑鼠 hover 與鍵盤 focus 進入時暫停自動輪播、離開後恢復,不能只靠 `prefers-reduced-motion` 這種需要使用者主動開啟系統設定才生效的機制。

## 驗證方式

路由結構改動後最關鍵的驗證是**網址完全不變**——用 `npm run build` 對照改動前後的路由清單逐一比對。互動邏輯(彈窗、面板、輪播)則實際用瀏覽器操作驗證,並用 `setInterval`/`clearInterval` 的 monkey-patch 計數確認切換分類頁面時計時器沒有洩漏或疊加。
