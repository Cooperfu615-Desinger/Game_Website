import { notFound } from 'next/navigation';
import { categories, getCategory } from '@/data/categories';
import { gamesByCategory } from '@/data/games';
import { company } from '@/data/company';
import { GameCard } from '@/components/GameCard';

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
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28">
      <h1 className="mb-3 text-4xl font-black text-fg"><span className="mr-3 text-secondary" aria-hidden="true">/</span>{cat.name}大廳</h1>
      <p className="mb-10 text-fg-muted">{cat.description}</p>
      {list.length === 0 ? (
        <p className="rounded-2xl border border-white/5 bg-surface p-12 text-center text-fg-muted">此類別遊戲即將推出,敬請期待</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {list.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      )}
    </div>
  );
}
