// src/data/themes.ts
export type ThemePreset = { name: string; primary: string; secondary: string };
export const DEFAULT_THEME: ThemePreset = { name: '霓虹紫玫', primary: '#7C3AED', secondary: '#F43F5E' };
export const presets: ThemePreset[] = [
  DEFAULT_THEME,
  { name: '街機霓虹', primary: '#DC2626', secondary: '#2563EB' },
  { name: '聚光金', primary: '#312E81', secondary: '#CA8A04' },
  { name: '暖橙餘燼', primary: '#312E81', secondary: '#F97316' },
  { name: '電競藍', primary: '#2563EB', secondary: '#22D3EE' },
];
