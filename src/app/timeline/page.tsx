import { company } from '@/data/company';
export const metadata = { title: `公司時間軸 | ${company.name}` };
export default function TimelinePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-36">
      <h1 className="mb-10 text-4xl font-black text-fg"><span className="mr-3 text-secondary" aria-hidden="true">/</span>公司時間軸</h1>
      <ol className="space-y-10 border-l-2 border-primary/40 pl-8">
        {company.milestones.map((m) => (
          <li key={m.year} className="relative">
            <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full bg-secondary" />
            <p className="text-2xl font-black text-secondary">{m.year}</p>
            <h2 className="mt-1 text-xl font-bold text-fg">{m.title}</h2>
            <p className="mt-2 text-fg-muted">{m.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
