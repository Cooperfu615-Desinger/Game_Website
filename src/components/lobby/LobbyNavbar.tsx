'use client';
import { useState } from 'react';
import Link from 'next/link';
import { company } from '@/data/company';
import { LoginModal } from './LoginModal';
import { ServicePanel } from './ServicePanel';
import { LanguageDropdown } from './LanguageDropdown';

export function LobbyNavbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-bg/60 backdrop-blur-lg">
        <nav className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="-my-2 py-2 text-lg font-black tracking-wider text-fg">
            {company.name}
          </Link>
          <div className="flex items-center gap-6 text-sm text-primary-soft">
            <button type="button" onClick={() => setLoginOpen(true)} className="transition hover:text-fg">
              登入
            </button>
            <Link href="/contact" className="transition hover:text-fg">聯絡我們</Link>
            <button type="button" onClick={() => setServiceOpen(true)} className="transition hover:text-fg">
              客服
            </button>
            <Link href="/" className="transition hover:text-fg">官網</Link>
            <LanguageDropdown />
          </div>
        </nav>
      </header>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <ServicePanel open={serviceOpen} onClose={() => setServiceOpen(false)} />
    </>
  );
}
