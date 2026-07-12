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
const HEX_RE = /^#[0-9a-f]{6}$/i;

function isValidThemeState(v: unknown): v is ThemeState {
  return (
    typeof v === 'object' && v !== null &&
    HEX_RE.test((v as ThemeState).primary ?? '') &&
    HEX_RE.test((v as ThemeState).secondary ?? '')
  );
}

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
        const parsed: unknown = JSON.parse(saved);
        if (isValidThemeState(parsed)) {
          setColorsState(parsed);
          applyToDom(parsed);
        } else {
          // 壞資料就用預設,並清掉避免下次再讀到
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch { /* 壞資料就用預設 */ }
  }, []);

  const setColors = (c: ThemeState) => {
    try {
      applyToDom(c);
    } catch { return; /* 非法色碼不套用、不儲存 */ }
    setColorsState(c);
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
