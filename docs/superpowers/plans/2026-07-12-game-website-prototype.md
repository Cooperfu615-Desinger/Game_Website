# 遊戲官網＋DEMO 大廳原型 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立內部展示用的遊戲公司官網＋DEMO 大廳原型:滿版滾動首頁、五個完整頁、三類遊戲大廳與遊戲頁、開發用即時調色系統。

**Architecture:** Next.js App Router 全靜態頁面,無後端;遊戲與公司資料集中於 `src/data/` TypeScript 檔;全站顏色走 CSS variables(Tailwind v4 `@theme inline` 映射),調色即時生效並存 localStorage;動畫用 Framer Motion(`motion` 套件)+ CSS scroll-snap。

**Tech Stack:** Next.js 15+(App Router, TypeScript)、Tailwind CSS v4、framer-motion、vitest(單元測試)

**規格來源:** `docs/superpowers/specs/2026-07-12-game-website-prototype-design.md`

---

## 檔案結構總覽

```
src/
  app/
    layout.tsx                     全站 layout(Navbar/Footer/ThemeProvider/DevColorPanel)
    globals.css                    CSS variables + @theme 映射 + scroll-snap
    page.tsx                       首頁(Hero + 五區塊)
    about/page.tsx                 公司簡介完整頁
    features/page.tsx              公司特色完整頁
    timeline/page.tsx              公司時間軸完整頁
    contact/page.tsx               聯絡我們完整頁
    games/page.tsx                 遊戲總覽(類別入口)
    games/[category]/page.tsx      類別大廳
    games/[category]/[slug]/page.tsx 遊戲專屬頁
  components/
    Navbar.tsx / Footer.tsx
    Reveal.tsx                     進場動畫包裝元件
    SectionHeader.tsx              區塊標題+「看全部」按鈕
    GameCard.tsx                   遊戲圖示卡(含縮圖 fallback)
    DemoFrame.tsx                  iframe / 佔位畫面
    theme/ThemeProvider.tsx        主題 context + CSS vars 套用 + localStorage
    theme/DevColorPanel.tsx        右下調色彈窗
  lib/color.ts                     色彩衍生純函式(hex↔hsl、deriveShades)
  data/
    types.ts / categories.ts / games.ts / company.ts / themes.ts
tests/
  color.test.ts                    色彩函式單元測試
  data.test.ts                     資料完整性測試
```

---

### Task 1: 專案鷹架

**Files:**
- Create: 整個 Next.js 專案(create-next-app 產生於暫存目錄後搬入,因專案根目錄已有 docs/.claude)

- [ ] **Step 1: 建立專案**

```bash
cd /Users/cooperfu/Desktop/Game_Website
npx create-next-app@latest web-tmp --ts --tailwind --eslint --app --src-dir --no-import-alias --use-npm --yes
# 搬入根目錄(保留既有 docs/.claude/.git)
rsync -a web-tmp/ ./ --exclude .git --exclude README.md
rm -rf web-tmp
npm install framer-motion
npm install -D vitest
```

- [ ] **Step 2: 在 package.json scripts 加入 test**

```json
"test": "vitest run"
```

- [ ] **Step 3: 驗證 build**

Run: `npm run build`
Expected: 編譯成功,無錯誤

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: Next.js 專案鷹架(TS/Tailwind/framer-motion/vitest)"
```

---

### Task 2: ui-ux-pro-max 設計系統產出

**Files:**
- Create: `design-system/`(由 skill 腳本產出)、`docs/design/palette.md`(摘錄選定色板)

- [ ] **Step 1: 產出設計系統**

```bash
cd .claude/skills/ui-ux-pro-max
python3 scripts/search.py "gaming entertainment slots casino vibrant" --design-system --project-name game-website -d /Users/cooperfu/Desktop/Game_Website
```

Expected: 產出 MASTER.md 含風格建議、色板(hex)、字型配對、UX checklist

- [ ] **Step 2: 摘錄採用的色板與字型到 docs/design/palette.md**

從 MASTER.md 選定主色/輔色/背景/文字色(hex 值)與 Google Fonts 字型配對,寫入 `docs/design/palette.md`。此色板作為 Task 4 `themes.ts` 的預設主題來源;若色板值與 Task 4 範例值不同,以此為準。

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "docs: ui-ux-pro-max 設計系統產出與選定色板"
```

---

### Task 3: 資料層(types/categories/games/company)

**Files:**
- Create: `src/data/types.ts`、`src/data/categories.ts`、`src/data/games.ts`、`src/data/company.ts`
- Test: `tests/data.test.ts`

- [ ] **Step 1: 寫 types.ts**

```ts
// src/data/types.ts
export type Category = { slug: string; name: string; description: string };
export type GameStatus = 'live' | 'dev';
export type GameSpecs = { reels?: string; lines?: string; rtp?: string; features: string[] };
export type Game = {
  slug: string; name: string; category: string; status: GameStatus;
  thumbnail?: string; screenshots: string[]; specs: GameSpecs; demoUrl?: string;
};
export type Milestone = { year: string; title: string; description: string };
```

- [ ] **Step 2: 寫 categories.ts**

```ts
// src/data/categories.ts
import type { Category } from './types';
export const categories: Category[] = [
  { slug: 'slots', name: '老虎機', description: '經典與創新兼具的視訊老虎機系列' },
  { slug: 'card', name: '棋牌', description: '多人對戰棋牌遊戲,支援即時對局' },
  { slug: 'mini', name: '迷你遊戲', description: '快節奏休閒小遊戲,即點即玩' },
];
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
```

- [ ] **Step 3: 寫 games.ts(示意資料,slots 6 款/card 4 款/mini 4 款)**

```ts
// src/data/games.ts
import type { Game } from './types';
export const games: Game[] = [
  { slug: 'fortune-dragon', name: '祥龍獻瑞', category: 'slots', status: 'live', screenshots: [], specs: { reels: '5×3', lines: '243 ways', rtp: '(示意值)96.5%', features: ['免費旋轉', '倍數符號', '巨額獎池'] } },
  { slug: 'golden-pyramid', name: '黃金金字塔', category: 'slots', status: 'live', screenshots: [], specs: { reels: '6×4', lines: 'Megaways', rtp: '(示意值)96.2%', features: ['連鎖消除', '累積倍數'] } },
  { slug: 'neon-city', name: '霓虹都市', category: 'slots', status: 'live', screenshots: [], specs: { reels: '5×4', lines: '40 lines', rtp: '(示意值)95.8%', features: ['夜間模式輪盤', 'Wild 擴展'] } },
  { slug: 'ocean-treasure', name: '深海寶藏', category: 'slots', status: 'dev', screenshots: [], specs: { reels: '5×3', lines: '25 lines', rtp: '(示意值)96.0%', features: ['漸進式獎池'] } },
  { slug: 'candy-burst', name: '糖果爆爆樂', category: 'slots', status: 'dev', screenshots: [], specs: { reels: '7×7', lines: 'Cluster Pays', rtp: '(示意值)96.4%', features: ['集群支付', '炸彈符號'] } },
  { slug: 'samurai-legend', name: '武士傳說', category: 'slots', status: 'dev', screenshots: [], specs: { reels: '5×3', lines: '30 lines', rtp: '(示意值)95.5%', features: ['對決加碼關卡'] } },
  { slug: 'texas-holdem', name: '德州撲克', category: 'card', status: 'live', screenshots: [], specs: { features: ['多人同桌', '錦標賽模式', '快速配桌'] } },
  { slug: 'big-two', name: '大老二', category: 'card', status: 'live', screenshots: [], specs: { features: ['2~4 人對戰', '好友房'] } },
  { slug: 'mahjong-16', name: '十六張麻將', category: 'card', status: 'dev', screenshots: [], specs: { features: ['台灣規則', 'AI 補位'] } },
  { slug: 'landlord', name: '鬥地主', category: 'card', status: 'dev', screenshots: [], specs: { features: ['經典三人', '加倍機制'] } },
  { slug: 'lucky-wheel', name: '幸運轉盤', category: 'mini', status: 'live', screenshots: [], specs: { features: ['每日轉盤', '連擊獎勵'] } },
  { slug: 'coin-pusher', name: '推金幣', category: 'mini', status: 'live', screenshots: [], specs: { features: ['物理引擎', '道具系統'] } },
  { slug: 'fishing-master', name: '捕魚達人', category: 'mini', status: 'dev', screenshots: [], specs: { features: ['多人同池', 'Boss 魚潮'] } },
  { slug: 'crash-rocket', name: '火箭衝天', category: 'mini', status: 'dev', screenshots: [], specs: { features: ['即時倍數曲線', '自動兌現'] } },
];
export const gamesByCategory = (slug: string) => games.filter((g) => g.category === slug);
export const getGame = (category: string, slug: string) => games.find((g) => g.category === category && g.slug === slug);
```

- [ ] **Step 4: 寫 company.ts(示意文案)**

```ts
// src/data/company.ts
import type { Milestone } from './types';
export const company = {
  name: '星河互動娛樂',
  tagline: '打造下一代線上遊戲體驗',
  intro: '星河互動娛樂專注於高品質 HTML5 遊戲研發,涵蓋老虎機、棋牌與迷你遊戲三大產品線。我們以數學模型驗證、極致美術與流暢體驗為核心,為全球合作夥伴提供穩定可靠的遊戲內容。(示意文案)',
  features: [
    { title: '自研遊戲引擎', description: '跨平台 HTML5 引擎,一次開發全端覆蓋。(示意)' },
    { title: '數學實驗室', description: '每款遊戲數值皆經大規模模擬驗證。(示意)' },
    { title: '美術工作室', description: '主題化視覺與動效,打造沉浸體驗。(示意)' },
    { title: '快速整合', description: '標準化 API,合作夥伴一週內上線。(示意)' },
  ],
  milestones: [
    { year: '2019', title: '公司成立', description: '核心團隊於台北成立工作室。(示意)' },
    { year: '2020', title: '首款老虎機上線', description: '祥龍獻瑞正式發行。(示意)' },
    { year: '2022', title: '棋牌產品線啟動', description: '德州撲克多人平台上線。(示意)' },
    { year: '2024', title: '迷你遊戲系列', description: '快節奏休閒產品線發布。(示意)' },
    { year: '2026', title: '次世代平台', description: '全新遊戲大廳與內容中台。(示意)' },
  ] as Milestone[],
  contact: { email: 'contact@example.com', phone: '+886-2-0000-0000', address: '台北市信義區示意路 100 號 10F' },
};
```

- [ ] **Step 5: 寫資料完整性測試**

```ts
// tests/data.test.ts
import { describe, it, expect } from 'vitest';
import { games } from '../src/data/games';
import { categories } from '../src/data/categories';

describe('資料完整性', () => {
  it('每款遊戲的 category 都存在於 categories', () => {
    const slugs = new Set(categories.map((c) => c.slug));
    for (const g of games) expect(slugs.has(g.category), `${g.name} 的類別 ${g.category} 不存在`).toBe(true);
  });
  it('遊戲 slug 在同類別內不重複', () => {
    const seen = new Set<string>();
    for (const g of games) {
      const key = `${g.category}/${g.slug}`;
      expect(seen.has(key), `重複:${key}`).toBe(false);
      seen.add(key);
    }
  });
  it('每個類別至少有一款遊戲', () => {
    for (const c of categories) expect(games.some((g) => g.category === c.slug), `${c.name} 無遊戲`).toBe(true);
  });
});
```

- [ ] **Step 6: 跑測試**

Run: `npm test`
Expected: 3 passed

- [ ] **Step 7: Commit**

```bash
git add src/data tests/data.test.ts && git commit -m "feat: 資料層(類別/遊戲/公司示意資料)與完整性測試"
```

---

### Task 4: 色彩衍生純函式(TDD)

**Files:**
- Create: `src/lib/color.ts`、`src/data/themes.ts`
- Test: `tests/color.test.ts`

- [ ] **Step 1: 寫失敗測試**

```ts
// tests/color.test.ts
import { describe, it, expect } from 'vitest';
import { hexToHsl, hslToHex, deriveShades } from '../src/lib/color';

describe('hexToHsl / hslToHex', () => {
  it('往返轉換一致', () => {
    for (const hex of ['#7c3aed', '#f59e0b', '#000000', '#ffffff']) {
      const { h, s, l } = hexToHsl(hex);
      expect(hslToHex(h, s, l).toLowerCase()).toBe(hex);
    }
  });
  it('純紅色 h=0 s=100 l=50', () => {
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 100, l: 50 });
  });
});

describe('deriveShades', () => {
  it('產出主/輔色的 strong、soft、faint 衍生階', () => {
    const vars = deriveShades('#7c3aed', '#f59e0b');
    expect(vars['--primary']).toBe('#7c3aed');
    expect(vars['--secondary']).toBe('#f59e0b');
    for (const k of ['--primary-strong', '--primary-soft', '--primary-faint', '--secondary-strong', '--secondary-soft', '--secondary-faint']) {
      expect(vars[k]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
  it('strong 比原色暗、soft 比原色亮', () => {
    const vars = deriveShades('#7c3aed', '#f59e0b');
    expect(hexToHsl(vars['--primary-strong']).l).toBeLessThan(hexToHsl('#7c3aed').l);
    expect(hexToHsl(vars['--primary-soft']).l).toBeGreaterThan(hexToHsl('#7c3aed').l);
  });
  it('極端亮色不會超出 0~100 範圍', () => {
    const vars = deriveShades('#ffffff', '#000000');
    expect(hexToHsl(vars['--primary-soft']).l).toBeLessThanOrEqual(100);
    expect(hexToHsl(vars['--secondary-strong']).l).toBeGreaterThanOrEqual(0);
  });
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `npm test`
Expected: FAIL(color.ts 不存在)

- [ ] **Step 3: 實作 color.ts**

```ts
// src/lib/color.ts
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

function shades(prefix: string, hex: string): Record<string, string> {
  const { h, s, l } = hexToHsl(hex);
  return {
    [`--${prefix}`]: hex,
    [`--${prefix}-strong`]: hslToHex(h, s, clamp(l - 14)),
    [`--${prefix}-soft`]: hslToHex(h, clamp(s - 10), clamp(l + 22)),
    [`--${prefix}-faint`]: hslToHex(h, clamp(s - 30), clamp(l + 42)),
  };
}

export function deriveShades(primary: string, secondary: string): Record<string, string> {
  return { ...shades('primary', primary), ...shades('secondary', secondary) };
}
```

- [ ] **Step 4: 跑測試確認通過**

Run: `npm test`
Expected: 全部 PASS(若往返測試因四捨五入誤差失敗,將測試改為 HSL 值誤差 ±1 內比對,不放寬其他斷言)

- [ ] **Step 5: 寫 themes.ts(預設主題;hex 值以 Task 2 palette.md 為準,以下為未執行時的預設)**

```ts
// src/data/themes.ts
export type ThemePreset = { name: string; primary: string; secondary: string };
export const DEFAULT_THEME: ThemePreset = { name: '霓虹紫金', primary: '#7c3aed', secondary: '#f59e0b' };
export const presets: ThemePreset[] = [
  DEFAULT_THEME,
  { name: '電競藍', primary: '#2563eb', secondary: '#22d3ee' },
  { name: '賭場紅金', primary: '#dc2626', secondary: '#fbbf24' },
  { name: '翡翠綠', primary: '#059669', secondary: '#a3e635' },
  { name: '桃紅霓虹', primary: '#db2777', secondary: '#818cf8' },
];
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/color.ts src/data/themes.ts tests/color.test.ts && git commit -m "feat: 色彩衍生純函式(TDD)與預設主題"
```

---

### Task 5: 主題系統(ThemeProvider + globals.css)

**Files:**
- Create: `src/components/theme/ThemeProvider.tsx`
- Modify: `src/app/globals.css`(create-next-app 產生的既有檔)

- [ ] **Step 1: 改寫 globals.css**

```css
@import "tailwindcss";

:root {
  --primary: #7c3aed;
  --primary-strong: #5b21b6;
  --primary-soft: #a78bfa;
  --primary-faint: #ede9fe;
  --secondary: #f59e0b;
  --secondary-strong: #b45309;
  --secondary-soft: #fcd34d;
  --secondary-faint: #fef3c7;
  --bg: #0b0b14;
  --surface: #16162a;
  --text: #f4f4f8;
  --text-muted: #9a9ab0;
}

@theme inline {
  --color-primary: var(--primary);
  --color-primary-strong: var(--primary-strong);
  --color-primary-soft: var(--primary-soft);
  --color-primary-faint: var(--primary-faint);
  --color-secondary: var(--secondary);
  --color-secondary-strong: var(--secondary-strong);
  --color-secondary-soft: var(--secondary-soft);
  --color-secondary-faint: var(--secondary-faint);
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--text);
  --color-fg-muted: var(--text-muted);
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); }

/* 首頁混搭滾動:proximity 只在 hero 產生吸附感 */
.snap-container { scroll-snap-type: y proximity; }
.snap-hero { scroll-snap-align: start; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .snap-container { scroll-snap-type: none; }
}
```

- [ ] **Step 2: 寫 ThemeProvider.tsx**

```tsx
// src/components/theme/ThemeProvider.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { deriveShades } from '@/lib/color';
import { DEFAULT_THEME } from '@/data/themes';

type ThemeState = { primary: string; secondary: string };
type ThemeContextValue = ThemeState & {
  setColors: (c: ThemeState) => void;
  reset: () => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'gw-theme-colors';

function applyToDom(c: ThemeState) {
  const vars = deriveShades(c.primary, c.secondary);
  for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty(k, v);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColorsState] = useState<ThemeState>({ primary: DEFAULT_THEME.primary, secondary: DEFAULT_THEME.secondary });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ThemeState;
        setColorsState(parsed);
        applyToDom(parsed);
      }
    } catch { /* 壞資料就用預設 */ }
  }, []);

  const setColors = (c: ThemeState) => {
    setColorsState(c);
    applyToDom(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  };
  const reset = () => {
    const c = { primary: DEFAULT_THEME.primary, secondary: DEFAULT_THEME.secondary };
    setColors(c);
    localStorage.removeItem(STORAGE_KEY);
  };

  return <ThemeContext.Provider value={{ ...colors, setColors, reset }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme 必須在 ThemeProvider 內使用');
  return ctx;
}
```

- [ ] **Step 3: 驗證 build**

Run: `npm run build`
Expected: 成功

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/theme/ThemeProvider.tsx && git commit -m "feat: CSS variables 主題系統與 ThemeProvider"
```

---

### Task 6: 調色彈窗 DevColorPanel

**Files:**
- Create: `src/components/theme/DevColorPanel.tsx`

- [ ] **Step 1: 寫 DevColorPanel.tsx**

```tsx
// src/components/theme/DevColorPanel.tsx
'use client';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { presets } from '@/data/themes';

export function DevColorPanel() {
  const [open, setOpen] = useState(false);
  const { primary, secondary, setColors, reset } = useTheme();

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-72 rounded-xl border border-primary/30 bg-surface p-4 shadow-2xl">
          <h3 className="mb-3 text-sm font-bold text-fg">開發調色工具</h3>
          <label className="mb-2 flex items-center justify-between text-sm text-fg-muted">
            主色
            <input type="color" value={primary} onChange={(e) => setColors({ primary: e.target.value, secondary })} className="h-8 w-14 cursor-pointer rounded" />
          </label>
          <label className="mb-3 flex items-center justify-between text-sm text-fg-muted">
            輔色
            <input type="color" value={secondary} onChange={(e) => setColors({ primary, secondary: e.target.value })} className="h-8 w-14 cursor-pointer rounded" />
          </label>
          <p className="mb-1 text-xs text-fg-muted">預設主題</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button key={p.name} onClick={() => setColors({ primary: p.primary, secondary: p.secondary })}
                className="rounded-full border border-fg-muted/30 px-2 py-1 text-xs text-fg hover:border-primary"
                style={{ background: `linear-gradient(90deg, ${p.primary}, ${p.secondary})` }}>
                {p.name}
              </button>
            ))}
          </div>
          <button onClick={reset} className="w-full rounded-lg border border-fg-muted/30 py-1.5 text-xs text-fg-muted hover:text-fg">重置為預設</button>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="開發調色工具"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white shadow-lg transition hover:bg-primary-strong">
        ⚙️
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 驗證 build**

Run: `npm run build`
Expected: 成功

- [ ] **Step 3: Commit**

```bash
git add src/components/theme/DevColorPanel.tsx && git commit -m "feat: 右下角開發用調色彈窗"
```

---

### Task 7: 全站 Layout / Navbar / Footer / 共用元件

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Navbar.tsx`、`src/components/Footer.tsx`、`src/components/Reveal.tsx`、`src/components/SectionHeader.tsx`

- [ ] **Step 1: 寫 Navbar.tsx**

```tsx
// src/components/Navbar.tsx
'use client';
import Link from 'next/link';
import { company } from '@/data/company';

const links = [
  { href: '/#about', label: '公司簡介' },
  { href: '/#features', label: '特色' },
  { href: '/#timeline', label: '時間軸' },
  { href: '/games', label: '遊戲' },
  { href: '/#contact', label: '聯絡我們' },
];

export function Navbar() {
  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-black tracking-wider text-fg">
          <span className="text-primary">★</span> {company.name}
        </Link>
        <ul className="hidden gap-6 text-sm text-fg-muted md:flex">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="transition hover:text-primary">{l.label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: 寫 Footer.tsx**

```tsx
// src/components/Footer.tsx
import { company } from '@/data/company';
export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 text-center text-sm text-fg-muted">
      <p>© 2026 {company.name} — 內部展示原型,非公開網站</p>
    </footer>
  );
}
```

- [ ] **Step 3: 寫 Reveal.tsx(進場動畫包裝)**

```tsx
// src/components/Reveal.tsx
'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: 寫 SectionHeader.tsx(標題＋看全部)**

```tsx
// src/components/SectionHeader.tsx
import Link from 'next/link';
export function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="text-3xl font-black text-fg md:text-4xl">
        <span className="mr-3 text-secondary">/</span>{title}
      </h2>
      <Link href={href} className="rounded-full border border-primary/50 px-4 py-1.5 text-sm text-primary transition hover:bg-primary hover:text-white">
        看全部 →
      </Link>
    </div>
  );
}
```

- [ ] **Step 5: 改寫 layout.tsx**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { DevColorPanel } from '@/components/theme/DevColorPanel';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { company } from '@/data/company';

export const metadata: Metadata = { title: company.name, description: company.tagline };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="antialiased">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <DevColorPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

(若 create-next-app 產生的 layout 有字型設定,保留 next/font 但字型改為 Task 2 palette.md 選定的 Google Fonts。)

- [ ] **Step 6: 驗證 build**

Run: `npm run build`
Expected: 成功

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/components && git commit -m "feat: 全站 layout 與共用元件(Navbar/Footer/Reveal/SectionHeader)"
```

---

### Task 8: 首頁(Hero 滿版吸附＋五區塊)

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/components/GameCard.tsx`(首頁遊戲精選也用)

- [ ] **Step 1: 寫 GameCard.tsx(含縮圖 fallback 與狀態徽章)**

```tsx
// src/components/GameCard.tsx
import Link from 'next/link';
import type { Game } from '@/data/types';

export function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.category}/${game.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-surface transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary-strong/60 to-secondary-strong/40">
        {game.thumbnail
          ? <img src={game.thumbnail} alt={game.name} className="h-full w-full object-cover" />
          : <span className="px-3 text-center text-xl font-black text-white/85">{game.name}</span>}
      </div>
      <div className="flex items-center justify-between p-3">
        <span className="text-sm font-bold text-fg">{game.name}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs ${game.status === 'live' ? 'bg-secondary/20 text-secondary' : 'bg-fg-muted/15 text-fg-muted'}`}>
          {game.status === 'live' ? '已上線' : '開發中'}
        </span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: 改寫 page.tsx**

```tsx
// src/app/page.tsx
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { GameCard } from '@/components/GameCard';
import { company } from '@/data/company';
import { categories } from '@/data/categories';
import { gamesByCategory } from '@/data/games';

export default function Home() {
  return (
    <div className="snap-container">
      {/* Hero:滿版吸附 */}
      <section className="snap-hero relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-primary-strong/40 via-bg to-bg">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative text-center">
          <h1 className="text-5xl font-black tracking-tight text-fg md:text-7xl">{company.name}</h1>
          <p className="mt-4 text-xl text-primary-soft md:text-2xl">{company.tagline}</p>
          <Link href="/games" className="mt-10 inline-block rounded-full bg-primary px-8 py-3 font-bold text-white transition hover:bg-primary-strong">
            探索遊戲 →
          </Link>
        </div>
        <span className="absolute bottom-8 animate-bounce text-fg-muted">▼ 往下滑動</span>
      </section>

      <div className="mx-auto max-w-6xl space-y-28 px-4 py-24">
        <section id="about" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="公司簡介" href="/about" />
            <p className="max-w-3xl text-lg leading-relaxed text-fg-muted">{company.intro}</p>
          </Reveal>
        </section>

        <section id="features" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="公司特色" href="/features" />
            <div className="grid gap-6 md:grid-cols-4">
              {company.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.1}>
                  <div className="h-full rounded-2xl border border-white/5 bg-surface p-6">
                    <h3 className="mb-2 font-bold text-primary-soft">{f.title}</h3>
                    <p className="text-sm text-fg-muted">{f.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="timeline" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="公司時間軸" href="/timeline" />
            <ol className="flex flex-col gap-4 md:flex-row md:gap-0">
              {company.milestones.map((m, i) => (
                <li key={m.year} className="relative flex-1 border-l-2 border-primary/40 pl-4 md:border-l-0 md:border-t-2 md:pl-0 md:pr-4 md:pt-4">
                  <span className="font-black text-secondary">{m.year}</span>
                  <p className="font-bold text-fg">{m.title}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section id="games" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="遊戲" href="/games" />
            {categories.map((c) => (
              <div key={c.slug} className="mb-10">
                <h3 className="mb-4 text-lg font-bold text-fg">{c.name}</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gamesByCategory(c.slug).slice(0, 3).map((g) => <GameCard key={g.slug} game={g} />)}
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="contact" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="聯絡我們" href="/contact" />
            <p className="text-fg-muted">{company.contact.email} ｜ {company.contact.phone}</p>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 驗證 build 與 dev 目視**

Run: `npm run build`,再 `npm run dev` 開 http://localhost:3000
Expected: hero 滿版且滾動有吸附感,五區塊依序進場動畫,「看全部」按鈕存在

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/GameCard.tsx && git commit -m "feat: 首頁滿版 Hero 與五區塊混搭滾動"
```

---

### Task 9: 四個完整頁(about/features/timeline/contact)

**Files:**
- Create: `src/app/about/page.tsx`、`src/app/features/page.tsx`、`src/app/timeline/page.tsx`、`src/app/contact/page.tsx`

- [ ] **Step 1: about/page.tsx**

```tsx
// src/app/about/page.tsx
import { company } from '@/data/company';
export const metadata = { title: `公司簡介 | ${company.name}` };
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28">
      <h1 className="mb-8 text-4xl font-black text-fg"><span className="mr-3 text-secondary">/</span>公司簡介</h1>
      <p className="text-lg leading-relaxed text-fg-muted">{company.intro}</p>
      <p className="mt-6 text-lg leading-relaxed text-fg-muted">
        我們的團隊由遊戲數學、前端引擎與美術設計專家組成,持續在三大產品線推出兼具娛樂性與穩定性的作品。(示意文案)
      </p>
    </div>
  );
}
```

- [ ] **Step 2: features/page.tsx**

```tsx
// src/app/features/page.tsx
import { company } from '@/data/company';
export const metadata = { title: `公司特色 | ${company.name}` };
export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28">
      <h1 className="mb-10 text-4xl font-black text-fg"><span className="mr-3 text-secondary">/</span>公司特色</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {company.features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/5 bg-surface p-8">
            <h2 className="mb-3 text-xl font-bold text-primary-soft">{f.title}</h2>
            <p className="leading-relaxed text-fg-muted">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: timeline/page.tsx**

```tsx
// src/app/timeline/page.tsx
import { company } from '@/data/company';
export const metadata = { title: `公司時間軸 | ${company.name}` };
export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28">
      <h1 className="mb-10 text-4xl font-black text-fg"><span className="mr-3 text-secondary">/</span>公司時間軸</h1>
      <ol className="space-y-10 border-l-2 border-primary/40 pl-8">
        {company.milestones.map((m) => (
          <li key={m.year} className="relative">
            <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full bg-secondary" />
            <p className="text-2xl font-black text-secondary">{m.year}</p>
            <h2 className="mt-1 text-xl font-bold text-fg">{m.title}</h2>
            <p className="mt-2 text-fg-muted">{m.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

- [ ] **Step 4: contact/page.tsx(表單僅 UI,不送出)**

```tsx
// src/app/contact/page.tsx
import { company } from '@/data/company';
export const metadata = { title: `聯絡我們 | ${company.name}` };
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28">
      <h1 className="mb-10 text-4xl font-black text-fg"><span className="mr-3 text-secondary">/</span>聯絡我們</h1>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-fg-muted">
          <p>Email:{company.contact.email}</p>
          <p>電話:{company.contact.phone}</p>
          <p>地址:{company.contact.address}</p>
        </div>
        <form className="space-y-4" aria-label="聯絡表單(原型,不會送出)">
          <input className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-fg" placeholder="您的名稱" />
          <input className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-fg" placeholder="Email" type="email" />
          <textarea className="h-28 w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-fg" placeholder="訊息內容" />
          <button type="button" className="w-full rounded-lg bg-primary py-2.5 font-bold text-white transition hover:bg-primary-strong">
            送出(原型示意)
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 驗證 build**

Run: `npm run build`
Expected: 成功,四頁皆產出

- [ ] **Step 6: Commit**

```bash
git add src/app/about src/app/features src/app/timeline src/app/contact && git commit -m "feat: 四個完整頁(簡介/特色/時間軸/聯絡)"
```

---

### Task 10: 遊戲總覽頁 /games

**Files:**
- Create: `src/app/games/page.tsx`

- [ ] **Step 1: 寫 games/page.tsx(類別入口卡片)**

```tsx
// src/app/games/page.tsx
import Link from 'next/link';
import { categories } from '@/data/categories';
import { gamesByCategory } from '@/data/games';
import { company } from '@/data/company';

export const metadata = { title: `遊戲總覽 | ${company.name}` };

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      <h1 className="mb-3 text-4xl font-black text-fg"><span className="mr-3 text-secondary">/</span>遊戲總覽</h1>
      <p className="mb-10 text-fg-muted">選擇類別進入遊戲大廳</p>
      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((c) => {
          const list = gamesByCategory(c.slug);
          const live = list.filter((g) => g.status === 'live').length;
          return (
            <Link key={c.slug} href={`/games/${c.slug}`}
              className="group rounded-3xl border border-white/5 bg-gradient-to-br from-surface to-primary-strong/20 p-8 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl">
              <h2 className="text-2xl font-black text-fg group-hover:text-primary-soft">{c.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{c.description}</p>
              <p className="mt-6 text-sm text-secondary">{list.length} 款遊戲 ・ {live} 款已上線 ・ {list.length - live} 款開發中</p>
              <span className="mt-4 inline-block text-primary">進入大廳 →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 驗證 build 後 Commit**

Run: `npm run build` → 成功

```bash
git add src/app/games/page.tsx && git commit -m "feat: 遊戲總覽頁(類別入口)"
```

---

### Task 11: 類別大廳 /games/[category]

**Files:**
- Create: `src/app/games/[category]/page.tsx`

- [ ] **Step 1: 寫類別大廳頁(含空狀態與 404)**

```tsx
// src/app/games/[category]/page.tsx
import { notFound } from 'next/navigation';
import { categories, getCategory } from '@/data/categories';
import { gamesByCategory } from '@/data/games';
import { GameCard } from '@/components/GameCard';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const list = gamesByCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      <h1 className="mb-3 text-4xl font-black text-fg"><span className="mr-3 text-secondary">/</span>{cat.name}大廳</h1>
      <p className="mb-10 text-fg-muted">{cat.description}</p>
      {list.length === 0 ? (
        <p className="rounded-2xl border border-white/5 bg-surface p-12 text-center text-fg-muted">此類別遊戲即將推出,敬請期待</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {list.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 驗證 build 後 Commit**

Run: `npm run build` → 成功,三類別頁皆靜態產出

```bash
git add "src/app/games/[category]/page.tsx" && git commit -m "feat: 類別大廳頁(遊戲圖示牆)"
```

---

### Task 12: 遊戲專屬頁 /games/[category]/[slug]

**Files:**
- Create: `src/components/DemoFrame.tsx`、`src/app/games/[category]/[slug]/page.tsx`

- [ ] **Step 1: 寫 DemoFrame.tsx(iframe / 佔位畫面)**

```tsx
// src/components/DemoFrame.tsx
export function DemoFrame({ demoUrl, name }: { demoUrl?: string; name: string }) {
  if (!demoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-primary-strong/50 to-surface">
        <div className="text-center">
          <p className="text-3xl font-black text-white/90">{name}</p>
          <p className="mt-3 rounded-full bg-secondary/20 px-4 py-1 text-sm text-secondary">DEMO 即將推出</p>
        </div>
      </div>
    );
  }
  return (
    <iframe src={demoUrl} title={`${name} DEMO`} allow="fullscreen"
      className="aspect-video w-full rounded-2xl border border-white/5 bg-black" />
  );
}
```

- [ ] **Step 2: 寫遊戲專屬頁**

```tsx
// src/app/games/[category]/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { games, getGame } from '@/data/games';
import { getCategory } from '@/data/categories';
import { DemoFrame } from '@/components/DemoFrame';

export function generateStaticParams() {
  return games.map((g) => ({ category: g.category, slug: g.slug }));
}

export default async function GamePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const game = getGame(category, slug);
  const cat = getCategory(category);
  if (!game || !cat) notFound();

  const specRows = [
    game.specs.reels && ['轉軸', game.specs.reels],
    game.specs.lines && ['線數', game.specs.lines],
    game.specs.rtp && ['RTP', game.specs.rtp],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28">
      <Link href={`/games/${category}`} className="text-sm text-fg-muted hover:text-primary">← 返回{cat.name}大廳</Link>
      <div className="mt-4 flex items-center gap-4">
        <h1 className="text-4xl font-black text-fg">{game.name}</h1>
        <span className={`rounded-full px-3 py-1 text-sm ${game.status === 'live' ? 'bg-secondary/20 text-secondary' : 'bg-fg-muted/15 text-fg-muted'}`}>
          {game.status === 'live' ? '已上線' : '開發中'}
        </span>
      </div>

      <div className="mt-8"><DemoFrame demoUrl={game.demoUrl} name={game.name} /></div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-bold text-fg"><span className="mr-2 text-secondary">/</span>遊戲示意圖</h2>
          <div className="grid grid-cols-2 gap-3">
            {(game.screenshots.length ? game.screenshots : [1, 2, 3, 4]).map((s, i) => (
              typeof s === 'string'
                ? <img key={i} src={s} alt={`${game.name} 截圖 ${i + 1}`} className="aspect-video rounded-xl object-cover" />
                : <div key={i} className="flex aspect-video items-center justify-center rounded-xl bg-surface text-xs text-fg-muted">示意圖 {s}</div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold text-fg"><span className="mr-2 text-secondary">/</span>規格與玩法</h2>
          {specRows.length > 0 && (
            <table className="mb-5 w-full text-sm">
              <tbody>
                {specRows.map(([k, v]) => (
                  <tr key={k} className="border-b border-white/5">
                    <td className="py-2 text-fg-muted">{k}</td>
                    <td className="py-2 text-right font-bold text-fg">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <ul className="space-y-2">
            {game.specs.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-fg-muted"><span className="text-secondary">◆</span>{f}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 驗證 build 後 Commit**

Run: `npm run build` → 成功,14 款遊戲頁皆靜態產出

```bash
git add src/components/DemoFrame.tsx "src/app/games/[category]/[slug]/page.tsx" && git commit -m "feat: 遊戲專屬頁(DEMO iframe/佔位+示意圖+規格)"
```

---

### Task 13: 全站驗收與收尾

**Files:**
- Create: `docs/decisions/2026-07-12-prototype-implementation.md`

- [ ] **Step 1: 全部測試與 build**

Run: `npm test && npm run lint && npm run build`
Expected: 測試全過、lint 無錯、build 成功

- [ ] **Step 2: 派 fresh-context agent 瀏覽器實走驗收(依全域守則不自驗)**

驗收清單:
1. 首頁:Hero 滿版、滾動吸附、五區塊進場動畫、五顆「看全部」可點
2. /about、/features、/timeline、/contact 內容正確
3. /games 三類別卡片 → 各大廳遊戲數正確(6/4/4)→ 任一遊戲頁佔位 DEMO、規格、示意圖顯示
4. 調色彈窗:改主色即時全站變色、切預設主題、重整後保留(localStorage)、重置還原
5. 手機視窗(375px):各頁不破版
6. 不存在的類別/遊戲網址回 404

- [ ] **Step 3: 寫實作決策記錄到 docs/decisions/**

記錄實作期間的技術決策與放棄方案(依實際情況撰寫)。

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "docs: 原型實作決策記錄與驗收結果"
```

---

## Self-Review 結果

- **規格覆蓋**:規格 §3 路由(Task 8-12)、§4 首頁(Task 8)、§5 資料模型(Task 3)、§6 調色(Task 4-6)、§7 邊界(GameCard fallback/DemoFrame 佔位/空狀態/reduced-motion 皆落在對應元件)、§8 測試驗收(Task 3/4/13)——無缺口
- **佔位符掃描**:無 TBD/TODO;Task 13 Step 3 為驗收後才能寫的記錄,屬預期行為
- **型別一致性**:`Game`/`Category`/`Milestone` 定義於 Task 3,後續引用名稱一致;`deriveShades` 簽名 Task 4 與 Task 5 一致
