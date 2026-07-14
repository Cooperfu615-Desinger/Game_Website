'use client';
import { useState } from 'react';

const LANGUAGES = ['繁體中文', '简体中文', 'English'];

export function LanguageDropdown() {
  const [lang, setLang] = useState(LANGUAGES[0]);

  return (
    <label className="flex items-center gap-1.5 text-sm text-primary-soft">
      <span className="sr-only">語系選擇</span>
      <select
        aria-label="語系選擇"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="h-11 cursor-pointer rounded-md border border-white/10 bg-bg px-2 text-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
    </label>
  );
}
