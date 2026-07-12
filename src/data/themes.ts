// src/data/themes.ts
export type ThemePreset = { name: string; primary: string; secondary: string };
export const DEFAULT_THEME: ThemePreset = { name: '霓虹紫玫', primary: '#7c3aed', secondary: '#f43f5e' };
export const presets: ThemePreset[] = [
  DEFAULT_THEME,
  { name: '街機霓虹', primary: '#dc2626', secondary: '#2563eb' },
  { name: '聚光金', primary: '#312e81', secondary: '#ca8a04' },
  { name: '暖橙餘燼', primary: '#312e81', secondary: '#f97316' },
  { name: '電競藍', primary: '#2563eb', secondary: '#22d3ee' },
];
