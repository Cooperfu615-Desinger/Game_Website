import { company } from '@/data/company';
export const metadata = { title: `公司特色 | ${company.name}` };
export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-36">
      <h1 className="mb-10 text-4xl font-black text-secondary">公司特色</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {company.features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/5 bg-surface p-8">
            <h2 className="mb-3 text-xl font-bold text-primary-soft">{f.title}</h2>
            <p className="leading-relaxed text-fg-muted">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
