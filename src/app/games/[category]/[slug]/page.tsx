import Link from 'next/link';
import { notFound } from 'next/navigation';
import { games, getGame } from '@/data/games';
import { getCategory } from '@/data/categories';
import { company } from '@/data/company';
import { DemoFrame } from '@/components/DemoFrame';

export function generateStaticParams() {
  return games.map((g) => ({ category: g.category, slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const game = getGame(category, slug);
  return { title: game ? `${game.name} | ${company.name}` : `遊戲 | ${company.name}` };
}

export default async function GamePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const game = getGame(category, slug);
  const cat = getCategory(category);
  if (!game || !cat) notFound();

  const specRows = [
    game.specs.reels && ['轉軸', game.specs.reels],
    game.specs.lines && ['線數', game.specs.lines],
    game.specs.rtp && ['RTP', game.specs.rtp],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-36">
      <Link href={`/games/${category}`} className="inline-block py-2 text-sm text-fg-muted hover:text-primary-soft">← 返回{cat.name}大廳</Link>
      <div className="mt-4 flex items-center gap-4">
        <h1 className="text-4xl font-black text-fg">{game.name}</h1>
        <span className={`rounded-full px-3 py-1 text-sm ${game.status === 'live' ? 'bg-secondary/30 text-secondary-soft' : 'bg-fg-muted/15 text-fg-muted'}`}>
          {game.status === 'live' ? '已上線' : '開發中'}
        </span>
      </div>

      <div className="mt-8"><DemoFrame demoUrl={game.demoUrl} name={game.name} /></div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-bold text-secondary">遊戲示意圖</h2>
          <div className="grid grid-cols-2 gap-3">
            {(game.screenshots.length ? game.screenshots : [1, 2, 3, 4]).map((s, i) => (
              typeof s === 'string'
                ? <img key={i} src={s} alt={`${game.name} 截圖 ${i + 1}`} className="aspect-video rounded-xl object-cover" />
                : <div key={i} className="flex aspect-video items-center justify-center rounded-xl bg-surface text-xs text-fg-muted">示意圖 {s}</div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-4 text-xl font-bold text-secondary">規格與玩法</h2>
          {specRows.length > 0 && (
            <table className="mb-5 w-full text-sm">
              <tbody>
                {specRows.map(([k, v]) => (
                  <tr key={k} className="border-b border-white/5">
                    <th scope="row" className="py-2 text-fg-muted text-left">{k}</th>
                    <td className="py-2 text-right font-bold text-fg">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <ul className="space-y-2">
            {game.specs.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-fg-muted"><span className="text-secondary" aria-hidden="true">◆</span>{f}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
