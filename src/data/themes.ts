// src/data/themes.ts
export type ThemePreset = { name: string; primary: string; secondary: string; base: string };
const SHARED_BASE = '#0f0f23';
export const DEFAULT_THEME: ThemePreset = { name: '霓虹紫玫', primary: '#7c3aed', secondary: '#f43f5e', base: SHARED_BASE };
export const presets: ThemePreset[] = [
  DEFAULT_THEME,
  { name: '街機霓虹', primary: '#dc2626', secondary: '#2563eb', base: SHARED_BASE },
  { name: '聚光金', primary: '#312e81', secondary: '#ca8a04', base: SHARED_BASE },
  { name: '暖橙餘燼', primary: '#312e81', secondary: '#f97316', base: SHARED_BASE },
  { name: '電競藍', primary: '#2563eb', secondary: '#22d3ee', base: SHARED_BASE },
];
