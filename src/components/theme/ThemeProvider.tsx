// src/components/theme/ThemeProvider.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { deriveShades, deriveBaseShades } from '@/lib/color';
import { DEFAULT_THEME } from '@/data/themes';
import {
  isValidThemeColors,
  normalizeThemeColors,
  THEME_STORAGE_KEY,
  type ThemeColors,
} from '@/lib/themeTool';

type ThemeContextValue = ThemeColors & {
  setColors: (c: ThemeColors) => void;
  reset: () => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyToDom(c: ThemeColors) {
  const vars = { ...deriveShades(c.primary, c.secondary), ...deriveBaseShades(c.base) };
  for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty(k, v);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColorsState] = useState<ThemeColors>({ primary: DEFAULT_THEME.primary, secondary: DEFAULT_THEME.secondary, base: DEFAULT_THEME.base });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isValidThemeColors(parsed)) {
          const normalized = normalizeThemeColors(parsed);
          // client-only 初始化:localStorage 僅 client 可讀,SSR 無值,故只能 mount 後同步套用
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setColorsState(normalized);
          applyToDom(normalized);
        } else {
          // 壞資料就用預設,並清掉避免下次再讀到
          localStorage.removeItem(THEME_STORAGE_KEY);
        }
      }
    } catch {
      try { localStorage.removeItem(THEME_STORAGE_KEY); } catch { /* 壞資料就用預設 */ }
    }
  }, []);

  const setColors = (c: ThemeColors) => {
    try {
      const normalized = normalizeThemeColors(c);
      applyToDom(normalized);
      setColorsState(normalized);
      try { localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(normalized)); } catch { /* 儲存失敗不阻止即時預覽 */ }
    } catch (e) { console.warn(e); /* 非法色碼不套用、不儲存 */ }
  };
  const reset = () => {
    const c = { primary: DEFAULT_THEME.primary, secondary: DEFAULT_THEME.secondary, base: DEFAULT_THEME.base };
    setColors(c);
    try { localStorage.removeItem(THEME_STORAGE_KEY); } catch { /* 無法存取時仍保留記憶體內重置 */ }
  };

  return <ThemeContext.Provider value={{ ...colors, setColors, reset }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme 必須在 ThemeProvider 內使用');
  return ctx;
}
