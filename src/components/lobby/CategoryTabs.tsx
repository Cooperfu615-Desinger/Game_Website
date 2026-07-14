import Link from 'next/link';
import { categories } from '@/data/categories';

export function CategoryTabs({ active }: { active: string }) {
  return (
    <div className="flex gap-3">
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/games/${c.slug}`}
          className={`rounded-full px-5 py-2 text-sm font-bold transition ${
            c.slug === active
              ? 'bg-primary text-white'
              : 'bg-surface text-fg-muted hover:text-fg'
          }`}>
          {c.name}
        </Link>
      ))}
    </div>
  );
}
