# 安裝 ui-ux-pro-max skill(僅主 skill)

日期:2026-07-12
決策者:Cooper(同意安裝)/ Claude(執行與建議)

## 決策
從 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (v2.6.2, MIT)
安裝**主 skill** `ui-ux-pro-max` 到本專案 `.claude/skills/ui-ux-pro-max/`(33 檔、1.5MB)。

## 依據
- 安裝前由 fresh-context subagent 完成全 repo 安全掃描(511 檔):
  無惡意程式碼、無 prompt injection、無 install hook、無敏感路徑竊取。
- 內容為離線設計知識庫(131 CSV:UI 風格/色板/字型/UX 準則)+ 本地 BM25 搜尋,
  核心功能純 Python 標準庫、不連網。含 Gaming/entertainment 向風格資料,切合本專案。

## 放棄的方案
1. **全套 7 個 sub-skill**:其餘 6 個偏 Premium 導流縮水版,多佔 context、
   增加誤觸發面;先只裝主 skill 試用,不夠再補。
2. **npx CLI / marketplace 安裝**:手動複製影響範圍最透明,且 repo 已在本機。
3. **裝到 ~/.claude/skills(全域)**:先限定本專案,確認有用再考慮全域。

## 注意事項
- design sub-skill 的產圖腳本會整檔載入 `~/.claude/.env`(找 GEMINI_API_KEY)。
  目前未安裝該 sub-skill;若日後要裝,GEMINI_API_KEY 放專案 .env,不放全域。
- skill 的 SKILL.md 約 690 行,觸發時會佔 context。
- 驗證方式:read-back(`diff -r` 來源 vs 安裝目錄,完全一致,33/33 檔)。
  腳本實跑驗證被安全政策擋下(外部程式碼未經使用者授權執行),
  首次實際使用時再確認 `python3 scripts/search.py` 可正常執行。
