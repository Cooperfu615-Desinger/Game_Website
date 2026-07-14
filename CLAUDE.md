# 專案守則(給接手的 AI session / 開發者看)

這份文件是給**未來接手這個 repo 的 Claude session**(或人類開發者)看的快速定位文件。目的是讓你不用重新爬一遍整個對話紀錄或 git log,就能知道「這裡的規矩是什麼、為什麼這樣做」。細節決策記錄在 `docs/decisions/`,這份文件只放「不寫下來會踩坑」的東西。

## 這是什麼專案

遊戲公司官網＋DEMO 大廳綜合型網站原型。**內部展示用,非公開商業網站**——雖然 repo 本身是公開的(GitHub Pages 部署,Cooper 已評估過風險並拍板,見下方),但這個決定的前提是**內容全部是佔位/示意資料**(公司名稱「星河互動娛樂」、14 款示意遊戲、RTP/MAXWIN 數值都標「(示意值)」)。**如果之後把示意資料換成真實公司資訊或真實數值,要重新評估 repo 是否該繼續公開**,不要延用舊的判斷。

- 技術棧:Next.js 16(App Router)+ TypeScript + Tailwind CSS v4 + framer-motion + Vitest
- 部署:GitHub Pages,`output: 'export'` 靜態匯出,`basePath: '/Game_Website'`
- 正式網址:`https://cooperfu615-desinger.github.io/Game_Website/`
- 無後端。所有看起來像「送出表單」「登入」「客服對話」的互動,全部是純前端示意,不接任何 API。**不要以為要幫這些接真實後端。**

## 目錄結構(route group 拆分,網址不受影響)

```
src/app/
  layout.tsx              根 layout:ThemeProvider/DevColorPanel/Footer,不含任何 Navbar
  (site)/                 官網區,用 src/components/Navbar.tsx(公司簡介/特色/時間軸/遊戲/聯絡我們)
    page.tsx / about / features / timeline / contact / games/page.tsx(遊戲總覽入口頁)
  (lobby)/                遊戲大廳區,用 src/components/lobby/LobbyNavbar.tsx(登入/聯絡我們/客服/官網/語系)
    games/[category]/
      layout.tsx           Banner 輪播 + CategoryTabs,大廳頁與單一遊戲頁共用
      page.tsx              大廳頁(篩選列 + 遊戲卡片網格)
      [slug]/page.tsx        單一遊戲頁
```

`(site)`、`(lobby)` 是 Next.js route group,資料夾名稱加括號**不會出現在網址上**——`/games` 來自 `(site)/games/page.tsx`,`/games/slots` 來自 `(lobby)/games/[category]/page.tsx`,兩者共存不衝突,這是刻意設計,不是意外。詳見 `docs/decisions/2026-07-14-lobby-route-groups.md`。

## 全站資源路徑要透過 `BASE_PATH`,不要寫死

`src/lib/basePath.ts` 匯出 `BASE_PATH = '/Game_Website'`,`next.config.ts` 的 `basePath`/`assetPrefix` 都從這個常數來。**任何在元件裡用 `<img src>`/`<video src>` 引用 `public/` 底下的檔案,都要組 `${BASE_PATH}/xxx/yyy`**,不能直接寫 `/videos/hero.mp4` 這種寫死的絕對路徑——本機 `npm run dev` 測試不會發現問題(因為 dev server 也吃 `basePath`,要訪問 `http://localhost:3000/Game_Website/` 才是正確測試方式),但部署到 GitHub Pages 後這些資源會全部 404。這個坑踩過一次,詳見 `docs/decisions/2026-07-13-github-pages-deploy.md`。

素材檔案位置與命名慣例:
- `public/videos/{sectionId}.mp4`:首頁 8 個背景影片(hero/about/features/timeline/slots/card/mini/contact)
- `public/games/{slug}.avif`:14 款遊戲的卡片縮圖,檔名對應 `src/data/games.ts` 的 `slug`
- `public/banners/{category}-{n}.{mp4|avif}`:大廳 Banner 輪播素材,每個類別可以有多張(目前 slots/card/mini 三個類別都還在共用同一組示意素材,見 `src/data/banners.ts`)

## 色彩術語:程式碼變數名稱跟 Cooper 口語說的「主色/輔色/點綴色」是分開的兩套命名

這個很容易搞混,務必先確認清楚再動色彩相關的程式碼:

| Cooper 說的(產品語言) | 程式碼變數(不會改名) | 實際角色 |
|---|---|---|
| **主色** | `--bg` / `--surface` | 全站面積最大的底色,`deriveBaseShades()` 推導 |
| **輔色** | `--primary` | 標題強調字/CTA 按鈕/選項文字,紫色系,`deriveShades()` 推導 |
| **點綴色** | `--secondary` | 小面積裝飾(徽章、區塊標題文字),玫紅色系 |

三個顏色都能在右下角開發用調色面板(`DevColorPanel`)即時調整,面板上的文字標籤用的是 Cooper 的說法(主色/輔色/點綴色),但底層程式碼 identifier 刻意沒有跟著改名(避免大規模改名風險)。詳見 `docs/decisions/2026-07-14-color-role-remap.md`。

## 工作方式慣例(這個專案怎麼被開發出來的)

- **Subagent 驅動開發**:每個功能性任務先派 subagent 實作,完成後再派一個**全新、不信任前面報告的** subagent 做規格符合度審查,通過後再派一個做程式碼品質審查。兩道審查都過才算數,審查員會親自讀程式碼、重跑 build/test,不接受「報告說做了」就算數。
- **驗證強度分兩檔**:調顏色 hex 值、文案、間距這種肉眼能判斷對錯、又很好反悔的小改動,直接改 → 跑 build 確認沒壞 → 截圖給 Cooper 看,不用跑完整雙審查。涉及邏輯、資料結構、部署設定、架構調整的改動,才走上面的雙審查流程。
- **Commit 完直接 push**,不用每次額外問——這是 Cooper 明確要求的,因為這個 repo 就是拿來即時 DEMO 用的。
- **決策與放棄的方案要寫進 `docs/decisions/`**,尤其是會影響後續維護的架構層級決定。
- 涉及機率、賠付、金額的任何遊戲數值(RTP、MAXWIN 等),一律標「(示意值)」前綴,不能讓人誤以為是真實數字。

## 已知的環境雷點

- **`.next/types` 有時會出現重複的型別檔案**(通常是雲端同步軟體造成的衝突副本,例如 `cache-life.d 2.ts`),導致 `tsc --noEmit` 誤報。遇到先 `rm -rf .next` 再重跑,不要當真的程式碼錯誤處理。
- **不要在 dev server 還在跑的時候執行 `rm -rf .next`**——會把 Turbopack 正在用的快取檔案砍掉,導致 dev server 壞掉(`Failed to open database` 之類的錯誤),需要重啟 server 才會恢復。
- 這個瀏覽器測試工具(Claude Browser pane)對「合成事件」(`.focus()`、`element.dispatchEvent(new MouseEvent('mouseleave'))`)的模擬不完全可靠——`mouseleave`/`focus` 這類原生不冒泡的事件,React 底層其實監聽的是 `mouseout`/`focusin`,用 JS 模擬測試互動邏輯時要用對應的冒泡事件,不然會誤判功能沒作用。真實使用者的滑鼠移動/Tab 鍵操作不受此限制影響。

## 更多細節

- 完整規格:`docs/superpowers/specs/2026-07-12-game-website-prototype-design.md`
- 實作計畫(13 個任務):`docs/superpowers/plans/2026-07-12-game-website-prototype.md`
- 配色拍板記錄:`docs/design/palette.md`
- 各項架構/技術決策:`docs/decisions/`(依日期排序,檔名說明主題)
