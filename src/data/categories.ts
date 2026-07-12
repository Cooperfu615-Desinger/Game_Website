import type { Category } from './types';

export const categories: Category[] = [
  { slug: 'slots', name: '老虎機', description: '經典與創新兼具的視訊老虎機系列' },
  { slug: 'card', name: '棋牌', description: '多人對戰棋牌遊戲,支援即時對局' },
  { slug: 'mini', name: '迷你遊戲', description: '快節奏休閒小遊戲,即點即玩' },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
