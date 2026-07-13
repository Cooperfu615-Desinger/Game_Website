import { company } from '@/data/company';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 text-center text-sm text-fg-muted">
      <p>© 2026 {company.name} — 內部展示原型,非公開網站</p>
    </footer>
  );
}
