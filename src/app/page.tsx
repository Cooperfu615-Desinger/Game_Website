import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { GameCard } from '@/components/GameCard';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { company } from '@/data/company';
import { getCategory } from '@/data/categories';
import { gamesByCategory } from '@/data/games';

export default function Home() {
  const slots = getCategory('slots')!;
  const card = getCategory('card')!;
  const mini = getCategory('mini')!;

  return (
    <>
      {/* Hero:滿版吸附 */}
      <BackgroundVideo src="hero.mp4" className="snap-hero h-[100dvh]">
        <div className="text-center">
          <h1 className="font-display text-5xl font-black tracking-tight text-fg md:text-7xl">{company.name}</h1>
          <p className="mt-4 text-xl text-primary-soft md:text-2xl">{company.tagline}</p>
          <Link href="/games" className="mt-10 inline-block rounded-full bg-primary px-8 py-3 font-bold text-white transition hover:bg-primary-strong">
            探索遊戲
          </Link>
        </div>
        <span className="absolute bottom-8 text-fg-muted">▼ 往下滑動</span>
      </BackgroundVideo>

      <BackgroundVideo src="about.mp4" id="about" className="scroll-mt-28 min-h-[80dvh] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeader title="公司簡介" href="/about" />
            <p className="max-w-3xl text-lg leading-relaxed text-fg-muted">{company.intro}</p>
          </Reveal>
        </div>
      </BackgroundVideo>

      <BackgroundVideo src="features.mp4" id="features" className="scroll-mt-28 min-h-[90dvh] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeader title="公司特色" href="/features" />
            <div className="grid gap-6 md:grid-cols-4">
              {company.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.1}>
                  <div className="h-full min-h-[366px] rounded-2xl border border-white/5 bg-surface/50 p-6 backdrop-blur-lg">
                    <h3 className="mb-2 font-bold text-primary-soft">{f.title}</h3>
                    <p className="text-sm text-fg">{f.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </BackgroundVideo>

      <BackgroundVideo src="timeline.mp4" id="timeline" className="scroll-mt-28 min-h-[80dvh] py-24">
        <div className="mx-auto max-w-6xl px-4">
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
        </div>
      </BackgroundVideo>

      <BackgroundVideo src="slots.mp4" id="games" className="scroll-mt-28 min-h-[90dvh] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeader title={slots.name} href={`/games/${slots.slug}`} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {gamesByCategory(slots.slug).slice(0, 3).map((g) => <GameCard key={g.slug} game={g} />)}
            </div>
          </Reveal>
        </div>
      </BackgroundVideo>

      <BackgroundVideo src="card.mp4" className="min-h-[90dvh] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeader title={card.name} href={`/games/${card.slug}`} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {gamesByCategory(card.slug).slice(0, 3).map((g) => <GameCard key={g.slug} game={g} />)}
            </div>
          </Reveal>
        </div>
      </BackgroundVideo>

      <BackgroundVideo src="mini.mp4" className="min-h-[90dvh] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeader title={mini.name} href={`/games/${mini.slug}`} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {gamesByCategory(mini.slug).slice(0, 3).map((g) => <GameCard key={g.slug} game={g} />)}
            </div>
          </Reveal>
        </div>
      </BackgroundVideo>

      <BackgroundVideo src="contact.mp4" id="contact" className="scroll-mt-28 min-h-[70dvh] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionHeader title="聯絡我們" href="/contact" />
            <p className="text-fg-muted">{company.contact.email} ・ {company.contact.phone}</p>
          </Reveal>
        </div>
      </BackgroundVideo>
    </>
  );
}
