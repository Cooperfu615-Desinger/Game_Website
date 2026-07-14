'use client';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { BASE_PATH } from '@/lib/basePath';
import { bannersByCategory } from '@/data/banners';
import type { CategorySlug } from '@/data/types';
import { nextIndex, prevIndex, resolveSwipe } from '@/lib/carousel';

const AUTO_PLAY_MS = 7000;

export function PromoBanner({ category }: { category: CategorySlug }) {
  const slides = bannersByCategory[category] ?? [];
  const [index, setIndex] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const reduceMotion = useReducedMotion();

  // 自動輪播:每 AUTO_PLAY_MS 切到下一張;reduceMotion 時不啟動計時器。
  // resetSignal 變動(手動拖曳/點擊圓點)會清掉舊計時器、重新起算七秒。
  // 切換類別時,由外層以 key={category} 讓本元件整個重新掛載,
  // 天然重置 index/resetSignal 並透過 cleanup 清掉舊計時器,不需在這裡額外處理。
  useEffect(() => {
    if (reduceMotion || slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => nextIndex(i, slides.length));
    }, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [reduceMotion, slides.length, resetSignal]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const decision = resolveSwipe(info.offset.x, info.velocity.x);
    if (decision === 'next') setIndex((i) => nextIndex(i, slides.length));
    else if (decision === 'prev') setIndex((i) => prevIndex(i, slides.length));
    setResetSignal((s) => s + 1);
  };

  const goTo = (i: number) => {
    setIndex(i);
    setResetSignal((s) => s + 1);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[360px] w-full overflow-hidden" role="region" aria-label="宣傳輪播">
      <motion.div
        className="h-full w-full cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}>
        {slides.map((slide, i) => {
          if (i !== index) return null;
          const src = `${BASE_PATH}/banners/${slide.src}`;
          return slide.type === 'video' ? (
            <video
              key={slide.src}
              className="pointer-events-none h-full w-full object-cover"
              src={src}
              autoPlay={!reduceMotion}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          ) : (
            <img
              key={slide.src}
              className="pointer-events-none h-full w-full object-cover"
              src={src}
              alt=""
              aria-hidden="true"
            />
          );
        })}
      </motion.div>
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`查看第 ${i + 1} 張`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
