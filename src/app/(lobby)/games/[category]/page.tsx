import { notFound } from 'next/navigation';
import { categories, getCategory } from '@/data/categories';
import { gamesByCategory } from '@/data/games';
import { company } from '@/data/company';
import { GameFilterBar } from '@/components/lobby/GameFilterBar';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  return { title: cat ? `${cat.name}大廳 | ${company.name}` : `遊戲 | ${company.name}` };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const list = gamesByCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24">
      <h1 className="mb-3 text-4xl font-black text-secondary">{cat.name}大廳</h1>
      <p className="mb-10 text-fg-muted">{cat.description}</p>
      {list.length === 0 ? (
        <p className="rounded-2xl border border-white/5 bg-surface p-12 text-center text-fg-muted">此類別遊戲即將推出,敬請期待</p>
      ) : (
        <GameFilterBar games={list} />
      )}
    </div>
  );
}
