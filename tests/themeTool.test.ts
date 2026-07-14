import { describe, expect, it } from 'vitest';
import {
  FIXED_TEXT_COLORS,
  MAX_SAVED_THEMES,
  THEME_HISTORY_LIMIT,
  createThemeHistory,
  formatThemeSummary,
  isValidThemeColors,
  normalizeHex,
  parseSavedThemes,
  persistSavedThemes,
  pushThemeHistory,
  redoThemeHistory,
  serializeSavedThemes,
  undoThemeHistory,
  type ThemeColors,
} from '../src/lib/themeTool';

const initial: ThemeColors = { base: '#0f0f23', primary: '#7c3aed', secondary: '#f43f5e' };

describe('調色工具色碼驗證', () => {
  it('只接受完整 #RRGGBB，並正規化為小寫', () => {
    expect(normalizeHex('  #7C3AED ')).toBe('#7c3aed');
    for (const invalid of ['#fff', '7c3aed', '#gg0000', '', '#1234567']) {
      expect(normalizeHex(invalid)).toBeNull();
    }
  });

  it('驗證完整三色物件', () => {
    expect(isValidThemeColors(initial)).toBe(true);
    expect(isValidThemeColors({ ...initial, base: 'red' })).toBe(false);
    expect(isValidThemeColors({ primary: '#7c3aed' })).toBe(false);
    expect(isValidThemeColors(null)).toBe(false);
  });
});

describe('已存方案資料', () => {
  it('versioned 格式可往返並正規化內容', () => {
    const raw = JSON.stringify({
      version: 1,
      schemes: [{ id: 'a', name: '  方案 A  ', colors: { ...initial, primary: '#7C3AED' } }],
    });
    const parsed = parseSavedThemes(raw);
    expect(parsed).toEqual([{ id: 'a', name: '方案 A', colors: initial }]);
    expect(parseSavedThemes(serializeSavedThemes(parsed))).toEqual(parsed);
  });

  it('壞掉的容器、舊版與非法記錄不會進入 UI', () => {
    expect(parseSavedThemes('{bad json')).toEqual([]);
    expect(parseSavedThemes(JSON.stringify({ version: 2, schemes: [] }))).toEqual([]);
    expect(parseSavedThemes(JSON.stringify({ version: 1, schemes: 'nope' }))).toEqual([]);

    const raw = JSON.stringify({
      version: 1,
      schemes: [
        { id: 'valid', name: '可用', colors: initial },
        { id: 'bad-color', name: '壞色碼', colors: { ...initial, base: '#fff' } },
        { id: 'blank-name', name: '   ', colors: initial },
        { id: 'valid', name: '重複 id', colors: initial },
      ],
    });
    expect(parseSavedThemes(raw).map((scheme) => scheme.id)).toEqual(['valid']);
  });

  it('只有 storage 寫入成功才回傳 true', () => {
    const scheme = { id: 'a', name: '方案 A', colors: initial };
    let savedKey = '';
    let savedValue = '';
    expect(persistSavedThemes(() => ({
      setItem(key, value) { savedKey = key; savedValue = value; },
    }), [scheme])).toBe(true);
    expect(savedKey).toBe('gw-saved-themes-v1');
    expect(parseSavedThemes(savedValue)).toEqual([scheme]);

    expect(persistSavedThemes(() => ({
      setItem() { throw new Error('quota exceeded'); },
    }), [scheme])).toBe(false);

    expect(persistSavedThemes(() => {
      throw new DOMException('blocked', 'SecurityError');
    }, [scheme])).toBe(false);
  });

  it('解析與序列化最多保留 50 組方案', () => {
    const schemes = Array.from({ length: MAX_SAVED_THEMES + 10 }, (_, index) => ({
      id: String(index),
      name: `方案 ${index}`,
      colors: initial,
    }));
    expect(parseSavedThemes(JSON.stringify({ version: 1, schemes }))).toHaveLength(MAX_SAVED_THEMES);
    const serialized = serializeSavedThemes(schemes);
    expect((JSON.parse(serialized) as { schemes: unknown[] }).schemes).toHaveLength(MAX_SAVED_THEMES);
    expect(parseSavedThemes(serialized)).toHaveLength(MAX_SAVED_THEMES);
  });
});

describe('調色 history', () => {
  it('undo / redo 正確往返，新增分支會清空 redo', () => {
    const second = { ...initial, primary: '#2563eb' };
    const third = { ...second, secondary: '#22d3ee' };
    let history = pushThemeHistory(createThemeHistory(initial), second);
    history = pushThemeHistory(history, third);

    history = undoThemeHistory(history);
    expect(history.present).toEqual(second);
    history = undoThemeHistory(history);
    expect(history.present).toEqual(initial);
    history = redoThemeHistory(history);
    expect(history.present).toEqual(second);

    history = pushThemeHistory(history, { ...second, base: '#111827' });
    expect(history.future).toEqual([]);
  });

  it('相同顏色不重複寫入，且 history 有 50 步上限', () => {
    let history = createThemeHistory(initial);
    expect(pushThemeHistory(history, { ...initial })).toBe(history);

    for (let index = 0; index < THEME_HISTORY_LIMIT + 20; index += 1) {
      const channel = (index % 256).toString(16).padStart(2, '0');
      history = pushThemeHistory(history, { ...initial, primary: `#${channel}3aed` });
    }
    expect(history.past).toHaveLength(THEME_HISTORY_LIMIT);
  });
});

describe('配色摘要', () => {
  it('含方案名稱、推導 surface、三色與固定文字色', () => {
    const summary = formatThemeSummary(initial, '穩重科技紫');
    expect(summary).toContain('方案名稱：穩重科技紫');
    expect(summary).toContain('主色／背景：#0F0F23');
    expect(summary).toContain('卡片底色（推導）：#1C1C35');
    expect(summary).toContain('輔色／操作：#7C3AED');
    expect(summary).toContain('點綴色：#F43F5E');
    expect(summary).toContain(FIXED_TEXT_COLORS.text.toUpperCase());
    expect(summary).toContain(FIXED_TEXT_COLORS.muted.toUpperCase());
  });

  it('沒有名稱時不輸出空的方案名稱列', () => {
    expect(formatThemeSummary(initial)).not.toContain('方案名稱');
  });
});
