import { describe, it, expect } from 'vitest';
import { nextIndex, prevIndex, resolveSwipe } from '../src/lib/carousel';

describe('nextIndex / prevIndex', () => {
  it('往下一張會循環回到第一張', () => {
    expect(nextIndex(0, 3)).toBe(1);
    expect(nextIndex(1, 3)).toBe(2);
    expect(nextIndex(2, 3)).toBe(0);
  });

  it('往上一張會循環回到最後一張', () => {
    expect(prevIndex(0, 3)).toBe(2);
    expect(prevIndex(2, 3)).toBe(1);
    expect(prevIndex(1, 3)).toBe(0);
  });

  it('length 為 0 時回傳 0,避免除以 0', () => {
    expect(nextIndex(0, 0)).toBe(0);
    expect(prevIndex(0, 0)).toBe(0);
  });

  it('只有一張時,永遠停在 0', () => {
    expect(nextIndex(0, 1)).toBe(0);
    expect(prevIndex(0, 1)).toBe(0);
  });
});

describe('resolveSwipe', () => {
  it('往左拖超過距離門檻視為下一張', () => {
    expect(resolveSwipe(-100, 0)).toBe('next');
  });

  it('往右拖超過距離門檻視為上一張', () => {
    expect(resolveSwipe(100, 0)).toBe('prev');
  });

  it('距離不夠但速度夠快,仍視為有效滑動', () => {
    expect(resolveSwipe(-10, -600)).toBe('next');
    expect(resolveSwipe(10, 600)).toBe('prev');
  });

  it('距離與速度都不夠,判定為彈回原位', () => {
    expect(resolveSwipe(10, 10)).toBe('none');
    expect(resolveSwipe(-10, -10)).toBe('none');
    expect(resolveSwipe(0, 0)).toBe('none');
  });

  it('恰好等於門檻視為有效滑動(邊界含入)', () => {
    expect(resolveSwipe(-80, 0)).toBe('next');
    expect(resolveSwipe(80, 0)).toBe('prev');
  });
});
