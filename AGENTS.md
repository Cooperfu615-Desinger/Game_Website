# AGENTS.md

給非 Claude Code 工具(OpenAI Codex、Grok 或其他支援 `AGENTS.md` 慣例的 agent)看的專案說明。**完整脈絡以 `CLAUDE.md` 為準**,這份文件是精簡版 + 指路,避免兩份文件內容重複之後各自更新、彼此兜不起來。

## 專案是什麼

遊戲公司官網＋DEMO 大廳綜合型網站原型。內部展示用,內容全部是佔位/示意資料(公司名稱、遊戲清單、RTP/MAXWIN 數值皆非真實)。Next.js 16(App Router)+ TypeScript + Tailwind CSS v4 + framer-motion + Vitest,`output: 'export'` 靜態匯出到 GitHub Pages,無後端。

## 快速指令

```bash
npm install
npm run dev      # 本機開發,注意 basePath 是 /Game_Website,要訪問 http://localhost:3000/Game_Website/
npm test         # vitest
npx tsc --noEmit # 型別檢查
npx eslint .
npm run build    # 靜態匯出到 out/
```

## 動手前務必先讀

- **`CLAUDE.md`**:完整的專案守則,包含目錄結構、色彩術語對照表(「主色/輔色/點綴色」跟程式碼變數名稱是反著對應的,不看這個很容易改錯)、`BASE_PATH` 資源路徑慣例(元件裡引用 `public/` 素材沒加這個前綴,本機測試看不出問題,部署到 GitHub Pages 會全部 404)、工作流程慣例、已知環境雷點。
- **`docs/decisions/`**:各項架構/技術決策的完整記錄與踩過的坑,依日期排序。
- **`docs/superpowers/specs/`、`docs/superpowers/plans/`**:原始規格與 13 任務實作計畫。

## 這份文件之外,其餘規範一律以 `CLAUDE.md` 為準,不重複寫。
