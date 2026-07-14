'use client';
import { useState } from 'react';
import type { Game } from '@/data/types';
import { GameCard } from '@/components/GameCard';

type FilterKey = 'all' | 'new' | 'popular';
type SortKey = 'default' | 'name-asc';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'new', label: '新推出' },
  { key: 'popular', label: '熱門' },
];

export function GameFilterBar({ games }: { games: Game[] }) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [query, setQuery] = useState('');

  const filtered = games.filter((g) => {
    if (filter === 'new' && !g.isNew) return false;
    if (filter === 'popular' && !g.isPopular) return false;
    if (query && !g.name.includes(query)) return false;
    return true;
  });

  const list = sort === 'name-asc'
    ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'))
    : filtered;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                filter === f.key
                  ? 'bg-primary text-white'
                  : 'bg-surface text-fg-muted hover:text-fg'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-1.5 text-sm text-fg-muted">
            <span className="sr-only">排序</span>
            <select
              aria-label="排序"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-fg">
              <option value="default">預設</option>
              <option value="name-asc">名稱 A-Z</option>
            </select>
          </label>
          <input
            type="text"
            aria-label="搜尋遊戲"
            placeholder="搜尋遊戲…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-fg"
          />
        </div>
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-white/5 bg-surface p-12 text-center text-fg-muted">沒有符合條件的遊戲</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {list.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      )}
    </div>
  );
}
