import Link from 'next/link';
import type { Game } from '@/data/types';
import { BASE_PATH } from '@/lib/basePath';

export function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.category}/${game.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-surface/50 backdrop-blur-lg transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl">
      <div className="flex aspect-[40/51] items-center justify-center bg-gradient-to-br from-primary-strong/60 to-secondary-strong/40">
        {game.thumbnail
          ? <img src={`${BASE_PATH}/games/${game.thumbnail}`} alt={game.name} loading="lazy" className="h-full w-full object-cover" />
          : <span className="px-3 text-center text-xl font-black text-white/85">{game.name}</span>}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-fg">{game.name}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs ${game.status === 'live' ? 'bg-secondary/30 text-secondary-soft' : 'bg-fg-muted/15 text-fg-muted'}`}>
            {game.status === 'live' ? '已上線' : '開發中'}
          </span>
        </div>
        {(game.specs.rtp || game.specs.maxWin) && (
          <div className="mt-1.5 space-y-0.5 text-xs text-fg-muted">
            {game.specs.rtp && <p>RTP {game.specs.rtp}</p>}
            {game.specs.maxWin && <p>MAXWIN {game.specs.maxWin}</p>}
          </div>
        )}
      </div>
    </Link>
  );
}
