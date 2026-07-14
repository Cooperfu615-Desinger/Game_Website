import { PromoBanner } from '@/components/lobby/PromoBanner';
import { CategoryTabs } from '@/components/lobby/CategoryTabs';

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
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <PromoBanner />
        <div className="mt-6"><CategoryTabs active={category} /></div>
      </div>
      {children}
    </div>
  );
}
