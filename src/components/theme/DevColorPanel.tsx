// src/components/theme/DevColorPanel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { DEFAULT_THEME, presets } from '@/data/themes';
import {
  SAVED_THEMES_STORAGE_KEY,
  MAX_SAVED_THEMES,
  createThemeHistory,
  formatThemeSummary,
  normalizeHex,
  parseSavedThemes,
  persistSavedThemes,
  pushThemeHistory,
  redoThemeHistory,
  serializeSavedThemes,
  themeColorsEqual,
  undoThemeHistory,
  type SavedTheme,
  type ThemeColors,
  type ThemeHistory,
} from '@/lib/themeTool';

type ColorRole = keyof ThemeColors;

const ROLE_META: Array<{ key: ColorRole; label: string; description: string }> = [
  { key: 'base', label: '主色', description: '頁面背景與卡片底色' },
  { key: 'primary', label: '輔色', description: '按鈕、選中狀態與重要操作' },
  { key: 'secondary', label: '點綴色', description: '標題、徽章與小面積裝飾' },
];

const defaultColors: ThemeColors = {
  primary: DEFAULT_THEME.primary,
  secondary: DEFAULT_THEME.secondary,
  base: DEFAULT_THEME.base,
};

function paletteStyle(colors: ThemeColors) {
  return {
    background: `linear-gradient(90deg, ${colors.base} 0 33%, ${colors.primary} 33% 66%, ${colors.secondary} 66%)`,
  };
}

export function DevColorPanel() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const currentColors: ThemeColors = { primary: theme.primary, secondary: theme.secondary, base: theme.base };
  const [sessionSnapshot, setSessionSnapshot] = useState<ThemeColors>(currentColors);
  const [history, setHistory] = useState<ThemeHistory>(() => createThemeHistory(currentColors));
  const [drafts, setDrafts] = useState<Record<ColorRole, string>>(currentColors);
  const [errors, setErrors] = useState<Partial<Record<ColorRole, string>>>({});
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const [schemeName, setSchemeName] = useState('');
  const [nameError, setNameError] = useState('');
  const [activeName, setActiveName] = useState<string>();
  const [announcement, setAnnouncement] = useState({ message: '', nonce: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [open]);

  const announce = (message: string) => {
    setAnnouncement((previous) => ({ message, nonce: previous.nonce + 1 }));
  };

  useEffect(() => {
    let raw: string | null = null;
    try { raw = localStorage.getItem(SAVED_THEMES_STORAGE_KEY); } catch { return; }
    const parsed = parseSavedThemes(raw);
    // client-only 初始化；同時將部分損壞或舊版資料清理成目前格式。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedThemes(parsed);
    if (raw && raw !== serializeSavedThemes(parsed)) {
      try {
        if (parsed.length > 0) localStorage.setItem(SAVED_THEMES_STORAGE_KEY, serializeSavedThemes(parsed));
        else localStorage.removeItem(SAVED_THEMES_STORAGE_KEY);
      } catch { /* 儲存空間不可用時仍可操作目前頁面 */ }
    }
  }, []);

  const saveSchemes = (next: SavedTheme[]): boolean => {
    setSavedThemes(next);
    return persistSavedThemes(() => localStorage, next);
  };

  const syncDrafts = (colors: ThemeColors) => {
    setDrafts({ base: colors.base, primary: colors.primary, secondary: colors.secondary });
    setErrors({});
  };

  const applyColors = (colors: ThemeColors, name?: string) => {
    theme.setColors(colors);
    setHistory((previous) => pushThemeHistory(previous, colors));
    syncDrafts(colors);
    setActiveName(name);
  };

  const togglePanel = () => {
    if (!open) {
      const snapshot = { ...currentColors };
      setSessionSnapshot(snapshot);
      setHistory(createThemeHistory(snapshot));
      syncDrafts(snapshot);
      setActiveName(undefined);
      announce('');
    }
    setOpen((value) => !value);
  };

  const updateRole = (role: ColorRole, value: string) => {
    applyColors({ ...currentColors, [role]: value });
  };

  const commitHex = (role: ColorRole) => {
    const normalized = normalizeHex(drafts[role]);
    if (!normalized) {
      setErrors((previous) => ({ ...previous, [role]: '請輸入完整的 #RRGGBB 色碼，例如 #7C3AED。' }));
      return;
    }
    setErrors((previous) => ({ ...previous, [role]: undefined }));
    setDrafts((previous) => ({ ...previous, [role]: normalized }));
    updateRole(role, normalized);
  };

  const moveHistory = (direction: 'undo' | 'redo') => {
    const next = direction === 'undo' ? undoThemeHistory(history) : redoThemeHistory(history);
    if (next === history) return;
    setHistory(next);
    theme.setColors(next.present);
    syncDrafts(next.present);
    setActiveName(undefined);
  };

  const restoreSession = () => applyColors(sessionSnapshot, '本次開啟初始');

  const resetProject = () => {
    theme.reset();
    setHistory((previous) => pushThemeHistory(previous, defaultColors));
    syncDrafts(defaultColors);
    setActiveName(DEFAULT_THEME.name);
  };

  const copyText = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      announce(successMessage);
    } catch {
      announce('複製失敗，請確認瀏覽器已允許剪貼簿權限。');
    }
  };

  const addSavedTheme = () => {
    const name = schemeName.trim();
    if (!name) {
      setNameError('請先輸入方案名稱。');
      return;
    }
    if (name.length > 40) {
      setNameError('方案名稱請控制在 40 個字以內。');
      return;
    }
    if (savedThemes.length >= MAX_SAVED_THEMES) {
      const message = `最多只能保存 ${MAX_SAVED_THEMES} 組方案，請先刪除不需要的方案。`;
      setNameError(message);
      announce(message);
      return;
    }
    const saved: SavedTheme = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name,
      colors: { ...currentColors },
    };
    const persisted = saveSchemes([...savedThemes, saved]);
    setSchemeName('');
    setNameError('');
    setActiveName(name);
    announce(persisted
      ? `已保存方案「${name}」。`
      : `方案「${name}」目前頁面可用，但瀏覽器無法儲存，重整後不會保留。`);
  };

  const removeSavedTheme = (scheme: SavedTheme) => {
    const persisted = saveSchemes(savedThemes.filter((item) => item.id !== scheme.id));
    if (activeName === scheme.name) setActiveName(undefined);
    announce(persisted
      ? `已刪除方案「${scheme.name}」。`
      : `方案「${scheme.name}」已從目前頁面刪除，但瀏覽器無法儲存，重整後可能再次出現。`);
  };

  const quickChoices = [
    { key: 'project-default', name: '原始（專案預設）', colors: defaultColors },
    { key: 'session', name: '本次開啟初始', colors: sessionSnapshot },
    ...presets.slice(1).map((preset) => ({ key: `preset-${preset.name}`, name: preset.name, colors: preset })),
  ];
  const summaryName = activeName
    ?? savedThemes.find((scheme) => themeColorsEqual(scheme.colors, currentColors))?.name
    ?? presets.find((preset) => themeColorsEqual(preset, currentColors))?.name;

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      {open && (
        <section
          aria-label="開發調色工具面板"
          className="mb-3 max-h-[calc(100dvh-6rem)] w-[min(26rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-primary/30 bg-surface/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base text-fg">開發調色工具</h2>
              <p className="mt-1 text-xs text-fg-muted">調整會即時套用至整個網站</p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={togglePanel}
              aria-label="關閉調色工具"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-fg-muted/30 text-xl text-fg-muted transition hover:border-primary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {ROLE_META.map((role) => (
              <div key={role.key} className="rounded-xl border border-fg-muted/20 bg-bg/35 p-3">
                <div className="mb-2">
                  <label htmlFor={`theme-${role.key}`} className="text-sm font-semibold text-fg">{role.label}</label>
                  <p className="mt-0.5 text-xs leading-5 text-fg-muted">{role.description}</p>
                </div>
                <div className="flex min-w-0 gap-2">
                  <input
                    id={`theme-${role.key}`}
                    type="color"
                    value={currentColors[role.key]}
                    onChange={(event) => updateRole(role.key, event.target.value)}
                    aria-label={`${role.label}色票`}
                    className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-fg-muted/30 bg-transparent p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black"
                  />
                  <input
                    type="text"
                    value={drafts[role.key]}
                    onChange={(event) => {
                      setDrafts((previous) => ({ ...previous, [role.key]: event.target.value }));
                      if (errors[role.key]) setErrors((previous) => ({ ...previous, [role.key]: undefined }));
                    }}
                    onBlur={() => commitHex(role.key)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') event.currentTarget.blur();
                      if (event.key === 'Escape') {
                        setDrafts((previous) => ({ ...previous, [role.key]: currentColors[role.key] }));
                        setErrors((previous) => ({ ...previous, [role.key]: undefined }));
                      }
                    }}
                    aria-label={`${role.label} HEX 色碼`}
                    aria-invalid={Boolean(errors[role.key])}
                    aria-describedby={errors[role.key] ? `${role.key}-error` : undefined}
                    spellCheck={false}
                    className="h-11 min-w-0 flex-1 rounded-lg border border-fg-muted/30 bg-bg/50 px-3 font-mono text-base uppercase text-fg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => copyText(currentColors[role.key].toUpperCase(), `已複製${role.label}色碼。`)}
                    aria-label={`複製${role.label}色碼`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-fg-muted/30 text-fg-muted transition hover:border-primary hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="8" y="8" width="11" height="11" rx="2" />
                      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                    </svg>
                  </button>
                </div>
                {errors[role.key] && <p id={`${role.key}-error`} role="alert" className="mt-2 text-xs leading-5 text-red-300">{errors[role.key]}</p>}
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => moveHistory('undo')} disabled={history.past.length === 0} className="min-h-11 rounded-lg border border-fg-muted/30 px-3 text-sm text-fg transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black">上一步</button>
            <button type="button" onClick={() => moveHistory('redo')} disabled={history.future.length === 0} className="min-h-11 rounded-lg border border-fg-muted/30 px-3 text-sm text-fg transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black">下一步</button>
            <button type="button" onClick={restoreSession} disabled={themeColorsEqual(currentColors, sessionSnapshot)} className="min-h-11 rounded-lg border border-fg-muted/30 px-3 text-sm text-fg-muted transition hover:border-primary hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black">恢復本次調整</button>
            <button type="button" onClick={resetProject} disabled={themeColorsEqual(currentColors, defaultColors)} className="min-h-11 rounded-lg border border-fg-muted/30 px-3 text-sm text-fg-muted transition hover:border-primary hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black">重置專案預設</button>
          </div>

          <div className="mt-5 border-t border-fg-muted/20 pt-4">
            <h3 className="text-sm font-bold text-fg">快速比較</h3>
            <p className="mt-1 text-xs leading-5 text-fg-muted">一鍵切換原始、本次初始、預設或已存方案。</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-primary px-3 py-2" aria-current="true">
                <div className="h-2.5 rounded-full" style={paletteStyle(currentColors)} />
                <p className="mt-2 text-xs font-semibold text-fg">目前</p>
              </div>
              {quickChoices.map((choice) => (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => applyColors(choice.colors, choice.name)}
                  disabled={themeColorsEqual(currentColors, choice.colors)}
                  className="min-h-11 rounded-lg border border-fg-muted/30 px-3 py-2 text-left transition hover:border-primary disabled:cursor-default disabled:border-primary/50 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black"
                >
                  <span className="block h-2.5 rounded-full" style={paletteStyle(choice.colors)} />
                  <span className="mt-2 block text-xs font-semibold text-fg">{choice.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-fg-muted/20 pt-4">
            <h3 className="text-sm font-bold text-fg">保存目前方案</h3>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={schemeName}
                onChange={(event) => { setSchemeName(event.target.value); if (nameError) setNameError(''); }}
                onKeyDown={(event) => { if (event.key === 'Enter') addSavedTheme(); }}
                maxLength={40}
                aria-label="方案名稱"
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? 'scheme-name-error' : undefined}
                placeholder="例如：穩重科技紫"
                className="h-11 min-w-0 flex-1 rounded-lg border border-fg-muted/30 bg-bg/50 px-3 text-base text-fg placeholder:text-fg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black"
              />
              <button type="button" onClick={addSavedTheme} className="min-h-11 shrink-0 rounded-lg bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black">保存</button>
            </div>
            {nameError && <p id="scheme-name-error" role="alert" className="mt-2 text-xs text-red-300">{nameError}</p>}

            {savedThemes.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {savedThemes.map((scheme) => (
                  <li key={scheme.id} className="flex items-stretch gap-2 rounded-lg border border-fg-muted/20 bg-bg/35 p-2">
                    <button type="button" onClick={() => applyColors(scheme.colors, scheme.name)} disabled={themeColorsEqual(currentColors, scheme.colors)} className="min-h-11 min-w-0 flex-1 rounded-md px-2 text-left transition hover:bg-primary/10 disabled:cursor-default disabled:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black">
                      <span className="block h-2.5 rounded-full" style={paletteStyle(scheme.colors)} />
                      <span className="mt-1.5 block truncate text-xs font-semibold text-fg">{scheme.name}</span>
                    </button>
                    <button type="button" onClick={() => removeSavedTheme(scheme)} aria-label={`刪除方案 ${scheme.name}`} className="flex h-11 w-11 shrink-0 items-center justify-center self-center rounded-md text-fg-muted transition hover:bg-red-500/15 hover:text-red-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 7h16M9 7V4h6v3m-9 0 1 13h10l1-13M10 11v5m4-5v5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-xs text-fg-muted">尚未保存自訂方案。</p>}
          </div>

          <button
            type="button"
            onClick={() => copyText(formatThemeSummary(currentColors, summaryName), '已複製完整配色摘要。')}
            className="mt-4 min-h-11 w-full rounded-lg border border-primary/60 px-4 text-sm font-bold text-fg transition hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black"
          >
            複製完整配色摘要
          </button>
          <p aria-live="polite" aria-atomic="true" className="mt-2 min-h-5 text-xs leading-5 text-primary-soft">
            <span key={announcement.nonce}>{announcement.message}</span>
          </p>
        </section>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={togglePanel}
        aria-label={open ? '關閉開發調色工具' : '開啟開發調色工具'}
        aria-expanded={open}
        className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-black"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
