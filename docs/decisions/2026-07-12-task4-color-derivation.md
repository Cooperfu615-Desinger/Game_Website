# Task 4:色彩衍生純函式(TDD)決策記錄

日期:2026-07-12

## 決策

1. **往返測試改為 HSL ±1 誤差比對**
   - 現象:hex→HSL 時 h/s/l 各自四捨五入為整數,回轉 hex 產生 off-by-one(實測 `#7c3aed` 往返得 `#7c3bed`)。
   - 處理:依計畫 Task 4 Step 4 預先授權的備註,僅將往返測試改為「hex→HSL→hex→HSL,h/s/l 各誤差 ≤1」比對;其他斷言(純紅色精確值、衍生階格式、明暗方向、0~100 邊界)未放寬。
   - 放棄方案:改用浮點 HSL 不取整(會改變 `hexToHsl` 對外回傳的整數契約,影響 Task 5 之後的使用直覺,不採)。

2. **themes.ts 採 Cooper 拍板值(取代計畫範例值)**
   - 預設主題:霓虹紫玫 `#7C3AED` / `#F43F5E`(docs/design/palette.md 方案 A 拍板記錄)。
   - 其餘 preset:街機霓虹、聚光金、暖橙餘燼、電競藍,依派工覆寫內容;與 palette.md「其餘方案保留作為預設主題切換選項」不矛盾。
   - 備註:聚光金/暖橙餘燼的 primary 取方案 C/D 的 Secondary `#312E81`(較 `#1E1B4B` 亮、衍生階可用範圍較大),secondary 取其 Accent;此映射由派工覆寫給定,未另行更動。

## 驗證方式

- `npm test`:8/8 通過(含既有 data 測試 3 條)。TDD 順序:先寫測試 → 確認失敗(模組不存在)→ 實作 → 往返誤差 → 依授權調整測試 → 全綠。
- `npx tsc --noEmit` 通過。
- 機率/賠付/金額:本任務不涉及。

## 2026-07-13 品質審查修正(commit 908e1d9 → 本次 fix)

1. **faint 改相對式**:原 `l + 42` 絕對加法,對 L≥58 的亮色會 clamp 成純白(#7c3aed 與 #f43f5e 的 faint 都變 #ffffff,色相消失且不可區分)。改為 `l + (100 - l) * 0.88`(飽和度維持 s-30)。依據:計畫檔範例 #7c3aed(L58)→ faint #ede9fe(L95),相對式 0.88 對 L58 給 L≈95 恰好還原此意圖;對深色 #312e81(L34)給 L≈92,仍是帶色相淺 tint。實測 faint:#7c3aed → #f0ebf9、#f43f5e → #faecee。
2. **輸入驗證**:deriveShades 開頭以 `/^#[0-9a-f]{6}$/i` 驗證兩參數,不符 throw(訊息含收到的值)。呼叫端(Task 5 ThemeProvider)接 input[type=color] 保證合法,throw 為 fail fast 語意,避免靜默產出 #NaNNaNNaN 汙染 CSS。
3. **Minor**:hexToHsl 回傳 `h % 360`;往返測試 hue 改環繞距離 `Math.min(d, 360-d)`;themes.ts hex 統一小寫。

驗證:新增「faint 不為純白且互異」「非法輸入 throw」兩條測試先行失敗後修正轉綠;`npm test` 10/10、`npx tsc --noEmit` 通過。
