import { company } from '@/data/company';
export const metadata = { title: `公司簡介 | ${company.name}` };
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28">
      <h1 className="mb-8 text-4xl font-black text-fg"><span className="mr-3 text-secondary" aria-hidden="true">/</span>公司簡介</h1>
      <p className="text-lg leading-relaxed text-fg-muted">{company.intro}</p>
      <p className="mt-6 text-lg leading-relaxed text-fg-muted">
        我們的團隊由遊戲數學、前端引擎與美術設計專家組成,持續在三大產品線推出兼具娛樂性與穩定性的作品。(示意文案)
      </p>
    </div>
  );
}
