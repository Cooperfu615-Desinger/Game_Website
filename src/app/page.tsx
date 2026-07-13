import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { GameCard } from '@/components/GameCard';
import { company } from '@/data/company';
import { categories } from '@/data/categories';
import { gamesByCategory } from '@/data/games';

export default function Home() {
  return (
    <>
      {/* Hero:滿版吸附 */}
      <section className="snap-hero relative flex h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-primary-strong/40 via-bg to-bg">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative text-center">
          <h1 className="font-display text-5xl font-black tracking-tight text-fg md:text-7xl">{company.name}</h1>
          <p className="mt-4 text-xl text-primary-soft md:text-2xl">{company.tagline}</p>
          <Link href="/games" className="mt-10 inline-block rounded-full bg-primary px-8 py-3 font-bold text-white transition hover:bg-primary-strong">
            探索遊戲 →
          </Link>
        </div>
        <span className="absolute bottom-8 animate-bounce text-fg-muted">▼ 往下滑動</span>
      </section>

      <div className="mx-auto max-w-6xl space-y-28 px-4 py-24">
        <section id="about" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="公司簡介" href="/about" />
            <p className="max-w-3xl text-lg leading-relaxed text-fg-muted">{company.intro}</p>
          </Reveal>
        </section>

        <section id="features" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="公司特色" href="/features" />
            <div className="grid gap-6 md:grid-cols-4">
              {company.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.1}>
                  <div className="h-full rounded-2xl border border-white/5 bg-surface p-6">
                    <h3 className="mb-2 font-bold text-primary-soft">{f.title}</h3>
                    <p className="text-sm text-fg-muted">{f.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="timeline" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="公司時間軸" href="/timeline" />
            <ol className="flex flex-col gap-4 md:flex-row md:gap-0">
              {company.milestones.map((m) => (
                <li key={m.year} className="relative flex-1 border-l-2 border-primary/40 pl-4 md:border-l-0 md:border-t-2 md:pl-0 md:pr-4 md:pt-4">
                  <span className="font-black text-secondary">{m.year}</span>
                  <p className="font-bold text-fg">{m.title}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section id="games" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="遊戲" href="/games" />
            {categories.map((c) => (
              <div key={c.slug} className="mb-10">
                <h3 className="mb-4 text-lg font-bold text-fg">{c.name}</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {gamesByCategory(c.slug).slice(0, 3).map((g) => <GameCard key={g.slug} game={g} />)}
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        <section id="contact" className="scroll-mt-20">
          <Reveal>
            <SectionHeader title="聯絡我們" href="/contact" />
            <p className="text-fg-muted">{company.contact.email} ｜ {company.contact.phone}</p>
          </Reveal>
        </section>
      </div>
    </>
  );
}
