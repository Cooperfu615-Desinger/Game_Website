# GitHub Pages 部署設定

## 背景

Cooper 要求開啟 GitHub Actions 自動部署,並在 GitHub Pages 產生一個可分享的公開網址,方便他隨時用連結做 DEMO 展示,不用每次都要開發者本機啟動才能看。

## 決策

1. **`next.config.ts` 設定 `output: 'export'`**:這個專案沒有後端、也沒有需要 server-side rendering 的動態內容(所有頁面都用 `generateStaticParams` 在 build 時產出),適合純靜態匯出,直接丟 GitHub Pages 就能跑,不需要 Node.js runtime。

2. **`basePath`/`assetPrefix` 設定為 `/Game_Website`**:GitHub Pages 的專案頁面(非 `username.github.io` 這種帳號根網站)網址格式是 `https://{user}.github.io/{repo}/`,網站實際跑在子路徑下,不是網域根目錄。這兩個設定值抽成 `src/lib/basePath.ts` 的 `BASE_PATH` 常數共用,避免字串重複維護。

3. **`.github/workflows/deploy.yml`**:main 分支 push 時觸發,流程為 `npm ci` → `npm test` → `npm run build` → 用 `actions/upload-pages-artifact` + `actions/deploy-pages` 部署產出的 `out/` 目錄。額外加了 `touch out/.nojekyll` 這個保險步驟(避免 GitHub Pages 的 Jekyll 處理器忽略 `_next` 這種底線開頭的資料夾——雖然 Actions 模式部署理論上不會跑 Jekyll 處理,但這是業界常見的零成本安全網寫法)。

4. **repo 設為公開**:Cooper 已明確評估過,這個專案內容目前全部是佔位/示意資料(公司名稱、遊戲清單、RTP 等數值皆非真實),公開沒有洩漏機敏資訊的風險。**這個判斷的前提是內容維持示意狀態**,若之後替換成真實資料要重新評估,見專案根目錄 `CLAUDE.md`。

## 踩過的坑(過程記錄,避免下次重踩)

### 坑 1:忘記設定 `basePath`,部署後全站樣式跑掉

第一次部署完,網址打開是完全沒有樣式的裸 HTML(連結是預設藍色底線、沒有配色沒有排版)。原因是 Next.js 靜態匯出預設把所有 CSS/JS 資源路徑指向網站**根目錄**(`/_next/...`),但 GitHub Pages 實際網址是子路徑(`/Game_Website/_next/...`),所有資源請求 404。

修法:`next.config.ts` 補上 `basePath: '/Game_Website'` 與 `assetPrefix: '/Game_Website/'`。**這個坑的延伸教訓**:凡是元件裡用 `<img>`/`<video>` 引用 `public/` 底下的靜態資源,都必須手動組 `${BASE_PATH}/xxx` 路徑(`next/image`、`next/link` 才會自動處理 basePath,純 `<img src>`/`<video src>` 不會)。這個站沒有用 `next/image`(有意識的選擇,見程式碼裡的 ESLint 豁免註解),所以每個引用外部素材的元件都要自己加這個前綴。

### 坑 2:改完 basePath 重新部署,網址還是顯示舊版本

修好 `basePath` 重新推送後,workflow 顯示部署成功,但打開網址還是樣式跑掉的舊畫面。一開始懷疑是修法沒生效,後來確認是 **GitHub Pages 背後的 Fastly CDN 快取延遲**——部署完成到全球節點都拿到新版本之間有傳播時間差(官方文件說最長可能到 10 分鐘)。用瀏覽器的 `cache: 'no-store'` fetch 直接檢查伺服器回傳的實際 HTML 內容(而非只看瀏覽器畫面),確認過一段時間後新版本才真的生效。**教訓**:部署後如果畫面看起來沒變,先用網路層級的請求(繞過瀏覽器快取)確認伺服器端到底吐出什麼,不要只憑瀏覽器畫面判斷,也不要太快斷定「修法沒用」。

## 驗證方式

每次部署後用 `gh run list` 輪詢 workflow 執行狀態直到 `completed`/`success`,再用瀏覽器實際打開正式網址(而非只信任 workflow 顯示成功)確認畫面正確,必要時檢查 Network 請求逐一確認資源都是 200 而非 404。
