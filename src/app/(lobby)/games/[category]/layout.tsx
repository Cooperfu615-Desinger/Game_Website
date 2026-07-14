import { PromoBanner } from '@/components/lobby/PromoBanner';
import { CategoryTabs } from '@/components/lobby/CategoryTabs';
import { CATEGORY_SLUGS, type CategorySlug } from '@/data/types';

function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const validCategory = isCategorySlug(category) ? category : null;
  return (
    <div className="pt-24">
      {/* 非法 category(例如手動改網址)不渲染 Banner;下方 page.tsx 的 notFound() 會接手顯示 404 */}
      {validCategory && <PromoBanner key={validCategory} category={validCategory} />}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-8 mb-10"><CategoryTabs active={category} /></div>
      </div>
      {children}
    </div>
  );
}
