'use client';
import { useReducedMotion } from 'framer-motion';
import { BASE_PATH } from '@/lib/basePath';

export function PromoBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="aspect-[3/1] overflow-hidden rounded-2xl">
      <video
        className="h-full w-full object-cover"
        src={`${BASE_PATH}/banners/promo.mp4`}
        autoPlay={!reduceMotion}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
}
