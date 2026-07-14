import type { CategorySlug } from './types';

export type BannerSlide = { type: 'video' | 'image'; src: string };

export const bannersByCategory: Record<CategorySlug, BannerSlide[]> = {
  slots: [
    { type: 'video', src: 'promo.mp4' },
    { type: 'image', src: 'promo.avif' },
  ],
  card: [
    { type: 'video', src: 'promo.mp4' },
    { type: 'image', src: 'promo.avif' },
  ],
  mini: [
    { type: 'video', src: 'promo.mp4' },
    { type: 'image', src: 'promo.avif' },
  ],
};
