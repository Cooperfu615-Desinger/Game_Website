# 首頁八段區塊背景影片

## 決策

首頁 8 個區塊(Hero/公司簡介/公司特色/公司時間軸/老虎機/棋牌/迷你遊戲/聯絡我們)
各自套上背景影片,取代原本的純色/漸層背景。

- 影片檔置於 `public/videos/{hero,about,features,timeline,slots,card,mini,contact}.mp4`,
  檔名對齊既有的 section `id` 與 `categories.ts` 的 `slug`,無需另建對照表。
- 新增 `src/components/BackgroundVideo.tsx`:進視窗(IntersectionObserver,
  `rootMargin: 200px`)才掛載 `<video>` 並開始抓取/播放,離開視窗即卸載,
  避免 8 支影片(共 54MB)在首頁載入當下同時播放拖垮效能。
- 尊重 `prefers-reduced-motion`:偵測為 reduce 時不加 `autoPlay`,影片停在
  首幀不動,不額外準備靜態圖 fallback。
- 遊戲區塊(原本老虎機/棋牌/迷你遊戲共用一個 section)拆成三個獨立
  `BackgroundVideo` 子區塊,各自的「看全部」也一併改為連向對應類別頁
  (`/games/slots` 等),不再統一連 `/games`。此改動經確認 Navbar「遊戲」
  連結本就直接指向 `/games` 頁面、不依賴首頁的 `#games` 錨點,故不影響導覽。

## 遮罩透明度:bg-bg/60

實際問題:8 支影片亮度差異極大(hero 為暗色星空,about 為明亮室內實拍)。
最初嘗試沿用原本 hero 區塊的 `bg-bg/70` 深色遮罩,結果暗色影片幾乎被完全
蓋掉看不出動態;調到 `bg-bg/45` 則亮色影片(about.mp4)上的淺色文字幾乎
無法閱讀。

驗證方式:用瀏覽器實際載入 build 後的靜態站台(而非用截圖臆測),對暗色
(hero,含最亮的星雲片段)與亮色(about,室內實拍)兩支影片個別測試多組
透明度,以「文字在該片段仍可辨識」為通過標準,收斂到 `bg-bg/60`
兩端都通過,採為統一預設值。

放棄方案:逐支影片個別調校透明度——8 組數值難以維護,且原型階段影片
內容可能還會替換,通用值更省事。若之後對某支影片有更精緻的呈現需求,
可在 `BackgroundVideo` 加一個 `overlayOpacity` 覆寫 prop,非阻擋改動。

## min-h-[Xdvh] 無 fallback(2026-07-13 補記)

各區塊 `min-h-[60vh]`/`min-h-[70vh]`/`min-h-[50vh]` 已隨 UI/UX 審查(commit
`e667ec4` 前的修正)改為 `dvh`,修正手機網址列顯示/收合造成的高度跳動。

刻意取捨:未額外提供 `vh` fallback(例如 `min-h-[60vh] min-h-[60dvh]` 疊加寫法)。
不支援 `dvh` 的舊瀏覽器會直接忽略該規則,退回無 `min-height` 限制,區塊高度
由內容自然撐開,不會破版,只是失去「至少佔滿視窗 X%」的視覺效果。

理由:本站現階段是內部展示原型,非公開網站,目標瀏覽器均為近期版本,
`dvh` 支援度已足夠;為極少數舊瀏覽器加雙寫 fallback的維護成本大於效益。
若之後轉為對外公開網站,需重新評估目標瀏覽器矩陣,屆時再補 fallback。

## 驗證

- `npm test`:12/12 通過
- `npx tsc --noEmit`:無錯誤
- `npx eslint .`:0 error(2 個既有的 img warning,非本次改動範圍)
- `npm run build`:26 頁全部靜態產出,`out/videos/` 含 8 支影片
- 瀏覽器實走:起本地靜態伺服器(帶 `/Game_Website` 子路徑,對齊 GitHub
  Pages 實際部署路徑)驗證影片載入播放、IntersectionObserver 進出視窗
  卸載/掛載、文字對比度
