import { describe, it, expect } from 'vitest';
import { games } from '../src/data/games';
import { categories } from '../src/data/categories';

describe('資料完整性', () => {
  it('每款遊戲的 category 都存在於 categories', () => {
    const slugs = new Set(categories.map((c) => c.slug));
    for (const g of games) {
      expect(slugs.has(g.category), `${g.name} 的類別 ${g.category} 不存在`).toBe(true);
    }
  });

  it('遊戲 slug 在同類別內不重複', () => {
    const seen = new Set<string>();
    for (const g of games) {
      const key = `${g.category}/${g.slug}`;
      expect(seen.has(key), `重複:${key}`).toBe(false);
      seen.add(key);
    }
  });

  it('每個類別至少有一款遊戲', () => {
    for (const c of categories) {
      expect(games.some((g) => g.category === c.slug), `${c.name} 無遊戲`).toBe(true);
    }
  });

  it('categories 自身 slug 不重複', () => {
    const seen = new Set<string>();
    for (const c of categories) {
      expect(seen.has(c.slug), `重複類別 slug:${c.slug}`).toBe(false);
      seen.add(c.slug);
    }
  });

  it('每款 slots 類遊戲的 specs 必含 reels、lines、rtp、maxWin', () => {
    for (const g of games.filter((g) => g.category === 'slots')) {
      expect(g.specs.reels, `${g.name} 缺 reels`).toBeTruthy();
      expect(g.specs.lines, `${g.name} 缺 lines`).toBeTruthy();
      expect(g.specs.rtp, `${g.name} 缺 rtp`).toBeTruthy();
      expect(g.specs.maxWin, `${g.name} 缺 maxWin`).toBeTruthy();
    }
  });
});
