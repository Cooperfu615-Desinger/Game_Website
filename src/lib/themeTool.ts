import { deriveBaseShades } from './color';

export type ThemeColors = {
  primary: string;
  secondary: string;
  base: string;
};

export type SavedTheme = {
  id: string;
  name: string;
  colors: ThemeColors;
};

export type ThemeHistory = {
  past: ThemeColors[];
  present: ThemeColors;
  future: ThemeColors[];
};

export const THEME_STORAGE_KEY = 'gw-theme-colors';
export const SAVED_THEMES_STORAGE_KEY = 'gw-saved-themes-v1';
export const THEME_HISTORY_LIMIT = 50;
export const MAX_SAVED_THEMES = 50;
export const FIXED_TEXT_COLORS = {
  text: '#e2e8f0',
  muted: '#9a9ab0',
} as const;

const HEX_RE = /^#[0-9a-f]{6}$/i;
const SAVED_THEMES_VERSION = 1;

export function isValidHex(value: unknown): value is string {
  return typeof value === 'string' && HEX_RE.test(value);
}

export function normalizeHex(value: string): string | null {
  const trimmed = value.trim();
  return isValidHex(trimmed) ? trimmed.toLowerCase() : null;
}

export function isValidThemeColors(value: unknown): value is ThemeColors {
  if (typeof value !== 'object' || value === null) return false;
  const colors = value as Partial<ThemeColors>;
  return isValidHex(colors.primary) && isValidHex(colors.secondary) && isValidHex(colors.base);
}

export function normalizeThemeColors(colors: ThemeColors): ThemeColors {
  return {
    primary: colors.primary.toLowerCase(),
    secondary: colors.secondary.toLowerCase(),
    base: colors.base.toLowerCase(),
  };
}

export function themeColorsEqual(a: ThemeColors, b: ThemeColors): boolean {
  return a.primary.toLowerCase() === b.primary.toLowerCase()
    && a.secondary.toLowerCase() === b.secondary.toLowerCase()
    && a.base.toLowerCase() === b.base.toLowerCase();
}

function isValidSavedTheme(value: unknown): value is SavedTheme {
  if (typeof value !== 'object' || value === null) return false;
  const theme = value as Partial<SavedTheme>;
  return typeof theme.id === 'string'
    && theme.id.length > 0
    && typeof theme.name === 'string'
    && theme.name.trim().length > 0
    && theme.name.trim().length <= 40
    && isValidThemeColors(theme.colors);
}

export function parseSavedThemes(raw: string | null): SavedTheme[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return [];
    const payload = parsed as { version?: unknown; schemes?: unknown };
    if (payload.version !== SAVED_THEMES_VERSION || !Array.isArray(payload.schemes)) return [];

    const seenIds = new Set<string>();
    return payload.schemes.flatMap((scheme) => {
      if (!isValidSavedTheme(scheme) || seenIds.has(scheme.id)) return [];
      seenIds.add(scheme.id);
      return [{
        id: scheme.id,
        name: scheme.name.trim(),
        colors: normalizeThemeColors(scheme.colors),
      }];
    }).slice(0, MAX_SAVED_THEMES);
  } catch {
    return [];
  }
}

export function serializeSavedThemes(schemes: SavedTheme[]): string {
  return JSON.stringify({ version: SAVED_THEMES_VERSION, schemes: schemes.slice(0, MAX_SAVED_THEMES) });
}

export function persistSavedThemes(
  getStorage: () => Pick<Storage, 'setItem'>,
  schemes: SavedTheme[],
): boolean {
  try {
    const storage = getStorage();
    storage.setItem(SAVED_THEMES_STORAGE_KEY, serializeSavedThemes(schemes));
    return true;
  } catch {
    return false;
  }
}

export function createThemeHistory(initial: ThemeColors): ThemeHistory {
  return { past: [], present: normalizeThemeColors(initial), future: [] };
}

export function pushThemeHistory(history: ThemeHistory, next: ThemeColors): ThemeHistory {
  const normalized = normalizeThemeColors(next);
  if (themeColorsEqual(history.present, normalized)) return history;
  return {
    past: [...history.past, history.present].slice(-THEME_HISTORY_LIMIT),
    present: normalized,
    future: [],
  };
}

export function undoThemeHistory(history: ThemeHistory): ThemeHistory {
  const previous = history.past.at(-1);
  if (!previous) return history;
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future].slice(0, THEME_HISTORY_LIMIT),
  };
}

export function redoThemeHistory(history: ThemeHistory): ThemeHistory {
  const next = history.future[0];
  if (!next) return history;
  return {
    past: [...history.past, history.present].slice(-THEME_HISTORY_LIMIT),
    present: next,
    future: history.future.slice(1),
  };
}

export function formatThemeSummary(colors: ThemeColors, name?: string): string {
  const normalized = normalizeThemeColors(colors);
  const surface = deriveBaseShades(normalized.base)['--surface'];
  const lines = [
    name?.trim() ? `方案名稱：${name.trim()}` : null,
    `主色／背景：${normalized.base.toUpperCase()}`,
    `卡片底色（推導）：${surface.toUpperCase()}`,
    `輔色／操作：${normalized.primary.toUpperCase()}`,
    `點綴色：${normalized.secondary.toUpperCase()}`,
    `主要文字（固定）：${FIXED_TEXT_COLORS.text.toUpperCase()}`,
    `次要文字（固定）：${FIXED_TEXT_COLORS.muted.toUpperCase()}`,
  ];
  return lines.filter((line): line is string => line !== null).join('\n');
}
