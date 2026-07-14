export const CATEGORY_SLUGS = ['slots', 'card', 'mini'] as const;
export type CategorySlug = typeof CATEGORY_SLUGS[number];
export type Category = { slug: string; name: string; description: string };
export type GameStatus = 'live' | 'dev';
export type GameSpecs = { reels?: string; lines?: string; rtp?: string; maxWin?: string; features: string[] };
export type Game = {
  slug: string;
  name: string;
  category: CategorySlug;
  status: GameStatus;
  thumbnail?: string;
  screenshots: string[];
  specs: GameSpecs;
  demoUrl?: string;
  isNew?: boolean;
  isPopular?: boolean;
};
export type Milestone = { year: string; title: string; description: string };
