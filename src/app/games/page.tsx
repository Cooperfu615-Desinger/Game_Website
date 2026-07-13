// src/app/games/page.tsx
import Link from 'next/link';
import { categories } from '@/data/categories';
import { gamesByCategory } from '@/data/games';
import { company } from '@/data/company';

export const metadata = { title: `遊戲總覽 | ${company.name}` };

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      <h1 className="mb-3 text-4xl font-black text-fg"><span className="mr-3 text-secondary" aria-hidden="true">/</span>遊戲總覽</h1>
      <p className="mb-10 text-fg-muted">選擇類別進入遊戲大廳</p>
      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((c) => {
          const list = gamesByCategory(c.slug);
          const live = list.filter((g) => g.status === 'live').length;
          return (
            <Link key={c.slug} href={`/games/${c.slug}`}
              className="group rounded-3xl border border-white/5 bg-gradient-to-br from-surface to-primary-strong/20 p-8 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl">
              <h2 className="text-2xl font-black text-fg group-hover:text-primary-soft">{c.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{c.description}</p>
              <p className="mt-6 text-sm text-secondary">{list.length} 款遊戲 ・ {live} 款已上線 ・ {list.length - live} 款開發中</p>
              <span className="mt-4 inline-block text-primary">進入大廳 →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
