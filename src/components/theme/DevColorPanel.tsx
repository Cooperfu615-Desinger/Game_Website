// src/components/theme/DevColorPanel.tsx
'use client';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { presets } from '@/data/themes';

export function DevColorPanel() {
  const [open, setOpen] = useState(false);
  const { primary, secondary, setColors, reset } = useTheme();

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-72 rounded-xl border border-primary/30 bg-surface p-4 shadow-2xl">
          <h3 className="mb-3 text-sm font-bold text-fg">開發調色工具</h3>
          <label className="mb-2 flex items-center justify-between text-sm text-fg-muted">
            主色
            <input type="color" value={primary} onChange={(e) => setColors({ primary: e.target.value, secondary })} className="h-8 w-14 cursor-pointer rounded" />
          </label>
          <label className="mb-3 flex items-center justify-between text-sm text-fg-muted">
            輔色
            <input type="color" value={secondary} onChange={(e) => setColors({ primary, secondary: e.target.value })} className="h-8 w-14 cursor-pointer rounded" />
          </label>
          <p className="mb-1 text-xs text-fg-muted">預設主題</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button key={p.name} onClick={() => setColors({ primary: p.primary, secondary: p.secondary })}
                className="rounded-full border border-fg-muted/30 px-2 py-1 text-xs text-fg hover:border-primary"
                style={{ background: `linear-gradient(90deg, ${p.primary}, ${p.secondary})` }}>
                {p.name}
              </button>
            ))}
          </div>
          <button onClick={reset} className="w-full rounded-lg border border-fg-muted/30 py-1.5 text-xs text-fg-muted hover:text-fg">重置為預設</button>
        </div>
      )}
      <button onClick={() => setOpen(!open)} aria-label="開發調色工具"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white shadow-lg transition hover:bg-primary-strong">
        ⚙️
      </button>
    </div>
  );
}
