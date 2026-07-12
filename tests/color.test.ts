// tests/color.test.ts
import { describe, it, expect } from 'vitest';
import { hexToHsl, hslToHex, deriveShades } from '../src/lib/color';

describe('hexToHsl / hslToHex', () => {
  it('往返轉換一致(HSL 值誤差 ±1 內;依計畫 Step 4 備註處理四捨五入誤差)', () => {
    for (const hex of ['#7c3aed', '#f59e0b', '#000000', '#ffffff']) {
      const { h, s, l } = hexToHsl(hex);
      const back = hexToHsl(hslToHex(h, s, l));
      const dh = Math.abs(back.h - h);
      expect(Math.min(dh, 360 - dh)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.s - s)).toBeLessThanOrEqual(1);
      expect(Math.abs(back.l - l)).toBeLessThanOrEqual(1);
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
  it('faint 對亮色不 clamp 成純白,且主/輔 faint 可區分', () => {
    const vars = deriveShades('#7C3AED', '#F43F5E');
    expect(vars['--primary-faint']).not.toBe('#ffffff');
    expect(vars['--secondary-faint']).not.toBe('#ffffff');
    expect(vars['--primary-faint']).not.toBe(vars['--secondary-faint']);
  });
  it('非法輸入 throw', () => {
    for (const bad of ['#abc', 'red', '']) {
      expect(() => deriveShades(bad, '#7c3aed')).toThrow();
      expect(() => deriveShades('#7c3aed', bad)).toThrow();
    }
  });
  it('極端亮色不會超出 0~100 範圍', () => {
    const vars = deriveShades('#ffffff', '#000000');
    expect(hexToHsl(vars['--primary-soft']).l).toBeLessThanOrEqual(100);
    expect(hexToHsl(vars['--secondary-strong']).l).toBeGreaterThanOrEqual(0);
  });
});
