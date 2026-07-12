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
