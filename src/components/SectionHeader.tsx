import Link from 'next/link';

export function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="text-3xl font-black text-fg md:text-4xl">
        <span className="mr-3 text-secondary" aria-hidden="true">/</span>{title}
      </h2>
      <Link href={href} className="rounded-full border border-primary/50 px-4 py-1.5 text-sm text-primary transition hover:bg-primary hover:text-white">
        看全部 →
      </Link>
    </div>
  );
}
