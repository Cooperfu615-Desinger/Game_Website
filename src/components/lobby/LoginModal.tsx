'use client';
import { useEffect, useRef } from 'react';

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      dialogRef.current?.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="登入"
        tabIndex={-1}
        className="w-full max-w-sm rounded-2xl bg-surface p-6 outline-none"
        onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-fg">登入</h2>
          <button
            type="button"
            aria-label="關閉登入視窗"
            onClick={onClose}
            className="text-fg-muted transition hover:text-fg">
            ✕
          </button>
        </div>
        <form className="space-y-4">
          <input
            name="account"
            type="text"
            aria-label="帳號"
            placeholder="帳號"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2.5 text-fg"
          />
          <input
            name="password"
            type="password"
            aria-label="密碼"
            placeholder="密碼"
            className="w-full rounded-lg border border-white/10 bg-bg px-4 py-2.5 text-fg"
          />
          <button
            type="button"
            className="w-full rounded-lg bg-primary py-2.5 font-bold text-white transition hover:bg-primary-strong">
            登入(原型示意)
          </button>
        </form>
      </div>
    </div>
  );
}
