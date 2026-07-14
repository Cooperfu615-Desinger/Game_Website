# 調色系統新增可調整主色、重新對齊主色/輔色/點綴色術語 決策記錄

日期:2026-07-14

## 背景

Cooper 定義的顏色角色與現有程式碼變數命名方向相反,先建立對照表釐清,再說明本次改動範圍。

## 1. 術語對照表

| Cooper 說的角色 | Cooper 的定義 | 對應到現有程式碼變數 | 現有程式碼裡的實際色值 |
|---|---|---|---|
| **主色** | 佔全站面積最大的底色 | `--bg` + `--surface`(本次改動前寫死,不可調) | `--bg: #0f0f23`、`--surface: #1e1c35` |
| **輔色** | 標題字/按鈕(看全部、探索遊戲)/選項文字 | `--primary`(可調) | 預設 `#7c3aed`(紫色) |
| **點綴色** | 小面積點綴(狀態徽章、裝飾符號) | `--secondary`(可調) | 預設 `#f43f5e`(玫紅) |

## 2. 為什麼內部變數名稱不改、只改 UI 顯示文字

- 內部 identifier(`--primary`/`--secondary`/`--bg`/`--surface`、`deriveShades`、`ThemeState.primary/secondary` 等)全部維持不變。
- 理由:這些 identifier 已有現成測試覆蓋(`tests/color.test.ts` 既有 12 條、ThemeProvider 的 `isValidThemeState`/`applyToDom` 邏輯),改名風險是「牽一髮動全身」但不產生任何使用者可見價值。改動範圍收斂到「新增 `base` 這個可調整項目」+「調色面板上的顯示文字對齊 Cooper 的說法」,把風險降到最低。
- 唯一新增的 identifier 是 `base`(`ThemeState.base`、`ThemePreset.base`、`deriveBaseShades()`),對應 Cooper 說的「主色」。

## 3. surface 推導公式與驗證結果

`deriveBaseShades(base)`:色相不變、飽和度 `-9`、明度 `+6`(`src/lib/color.ts`)。

```ts
export function deriveBaseShades(base: string): Record<string, string> {
  const { h, s, l } = hexToHsl(base);
  return {
    '--bg': base,
    '--surface': hslToHex(h, clamp(s - 9), clamp(l + 6)),
  };
}
```

驗證:輸入預設值 `#0f0f23` 算出 `--surface` 為 `#1c1c35`,對比原本寫死的 `#1e1c35`,R 通道差 2 個色階(`0x1c` vs `0x1e`),視覺上幾乎無法分辨。已用 `tests/color.test.ts` 的 `deriveBaseShades` describe 區塊(5 條測試)驗證:輸出格式、surface 比 bg 亮、貼近寫死值的精確斷言、非法輸入 throw、極端亮色（`#ffffff`）不超出 0~100 範圍。另外用瀏覽器實跑(dev server + `computer` 截圖 + `getComputedStyle` 讀值)確認：
- 首頁載入後視覺與改動前幾乎無差異。
- 拖動「主色」色票(例如改成 `#0a3d1f`)後,`--bg`/`--surface` 即時反映在 header、卡片背景、調色面板背景上,CTA 按鈕(綁定 `--primary`)顏色不受影響。
- 拖動「輔色」色票後,CTA 按鈕、齒輪按鈕(綁定 `--primary`)即時變色。
- 點擊預設主題按鈕、點擊「重置為預設」皆正確套用/還原三色,且 localStorage 正確寫入/清除。

## 4. `--text`/`--text-muted` 刻意不隨主色連動

前景文字色(`--text`/`--text-muted`)本次維持固定值,不隨「主色」（`--bg`/`--surface`）連動。列為之後可能的待辦:若之後「主色」開放給使用者自由選色(而非僅五組預設共用同一值),深色主色配固定淺色文字在極端情況下可能出現對比度問題,屆時需評估是否加入對比度自動修正或限制可選色域。

## 5. 五組預設主題目前共用同一個主色值

`src/data/themes.ts` 的五組 `ThemePreset` 目前 `base` 全部是 `#0f0f23`,只有 `primary`/`secondary`(輔色/點綴色)因主題而異。維持現有 presets「只有強調色隨主題變化」的設計精神,不因新增 `base` 欄位而改變既有視覺切換行為。

## 驗證方式總覽

- `npm test`:17/17 通過(既有 12 + 新增 `deriveBaseShades` 5 條)。
- `npx tsc --noEmit`:無錯誤。
- `npx eslint .`:0 error(2 個既有 `<img>` warning,與本次改動無關)。
- `npm run build`:成功,26 頁全部靜態產出。
- 瀏覽器實測(dev server,`http://localhost:3000/Game_Website/`):首頁視覺比對、調色面板三個 color input 順序與文字(主色/輔色/點綴色)、拖動主色即時變更全站底色、拖動輔色即時變更 CTA/齒輪按鈕、預設主題套用、重置為預設還原,皆通過並截圖存證。
