import { PromoBanner } from '@/components/lobby/PromoBanner';
import { CategoryTabs } from '@/components/lobby/CategoryTabs';
import type { CategorySlug } from '@/data/types';

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return (
    <div className="pt-24">
      <PromoBanner key={category} category={category as CategorySlug} />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-8 mb-10"><CategoryTabs active={category} /></div>
      </div>
      {children}
    </div>
  );
}
