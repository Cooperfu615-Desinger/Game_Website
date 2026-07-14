'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Message = { sender: 'user' | 'agent'; text: string };

const GREETING: Message = {
  sender: 'agent',
  text: '您好,客服為您服務,請問需要什麼協助?(原型示意,不會真的回覆)',
};

export function ServicePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
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
      panelRef.current?.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
  };

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="客服"
      tabIndex={-1}
      className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm translate-x-0 flex-col bg-surface outline-none ${
        reduceMotion ? '' : 'lobby-panel-slide-in'
      }`}>
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <h2 className="text-xl font-black text-fg">客服</h2>
        <button
          type="button"
          aria-label="關閉客服視窗"
          onClick={onClose}
          className="text-fg-muted transition hover:text-fg">
          ✕
        </button>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((m, i) => (
          <p
            key={i}
            className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
              m.sender === 'user'
                ? 'ml-auto bg-primary text-white'
                : 'mr-auto bg-bg text-fg-muted'
            }`}>
            {m.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2 border-t border-white/5 p-4">
        <input
          type="text"
          aria-label="輸入客服訊息"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="輸入訊息…"
          className="flex-1 rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm text-fg"
        />
        <button
          type="button"
          onClick={handleSend}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-strong">
          送出
        </button>
      </div>
    </div>
  );
}
