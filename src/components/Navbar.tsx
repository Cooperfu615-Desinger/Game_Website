'use client';
import Link from 'next/link';
import { company } from '@/data/company';

const links = [
  { href: '/#about', label: '公司簡介' },
  { href: '/#features', label: '特色' },
  { href: '/#timeline', label: '時間軸' },
  { href: '/games', label: '遊戲' },
  { href: '/#contact', label: '聯絡我們' },
];

export function Navbar() {
  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-black tracking-wider text-fg">
          <span className="text-primary">★</span> {company.name}
        </Link>
        <ul className="hidden gap-6 text-sm text-fg-muted md:flex">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="transition hover:text-primary">{l.label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
