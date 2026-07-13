'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { BASE_PATH } from '@/lib/basePath';

export function BackgroundVideo({
  src,
  id,
  children,
  className = '',
}: {
  src: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '200px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {inView && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={`${BASE_PATH}/videos/${src}`}
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-bg/60" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg to-transparent md:h-32" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent md:h-32" />
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
