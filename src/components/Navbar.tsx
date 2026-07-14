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
    <header className="fixed top-0 z-40 w-full border-b border-white/5 bg-bg/60 backdrop-blur-lg">
      <nav className="mx-auto flex h-24 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="-my-2 py-2 text-lg font-black tracking-wider text-fg">
          {company.name}
        </Link>
        <ul className="hidden gap-6 text-sm text-primary-soft md:flex">
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} className="inline-block py-2 transition hover:text-fg">{l.label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
