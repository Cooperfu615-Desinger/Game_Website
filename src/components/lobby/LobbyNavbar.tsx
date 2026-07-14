'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { company } from '@/data/company';
import { LoginModal } from './LoginModal';
import { ContactModal } from './ContactModal';
import { ServicePanel } from './ServicePanel';
import { LanguageDropdown } from './LanguageDropdown';

type ActiveDialog = 'login' | 'contact' | 'service' | null;

export function LobbyNavbar() {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const closeDialog = useCallback(() => setActiveDialog(null), []);

  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-bg/60 backdrop-blur-lg">
        <nav className="mx-auto flex h-24 max-w-6xl items-center justify-end px-4 md:justify-between">
          <Link href="/" className="hidden min-h-11 items-center text-lg font-black tracking-wider text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:inline-flex">
            {company.name}
          </Link>
          <div className="flex items-center gap-2 text-sm text-primary-soft sm:gap-5 lg:gap-6">
            <button type="button" onClick={() => setActiveDialog('login')} className="min-h-11 min-w-11 transition hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              登入
            </button>
            <button type="button" onClick={() => setActiveDialog('contact')} className="min-h-11 min-w-11 transition hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              聯絡我們
            </button>
            <button type="button" onClick={() => setActiveDialog('service')} className="min-h-11 min-w-11 transition hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              客服
            </button>
            <Link href="/" className="inline-flex min-h-11 min-w-11 items-center justify-center transition hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">官網</Link>
            <LanguageDropdown />
          </div>
        </nav>
      </header>
      <LoginModal open={activeDialog === 'login'} onClose={closeDialog} />
      <ContactModal open={activeDialog === 'contact'} onClose={closeDialog} />
      <ServicePanel open={activeDialog === 'service'} onClose={closeDialog} />
    </>
  );
}
