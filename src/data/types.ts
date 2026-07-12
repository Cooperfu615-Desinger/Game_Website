export type Category = { slug: string; name: string; description: string };
export type GameStatus = 'live' | 'dev';
export type GameSpecs = { reels?: string; lines?: string; rtp?: string; features: string[] };
export type Game = {
  slug: string;
  name: string;
  category: string;
  status: GameStatus;
  thumbnail?: string;
  screenshots: string[];
  specs: GameSpecs;
  demoUrl?: string;
};
export type Milestone = { year: string; title: string; description: string };
