import Link from 'next/link';

export function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="text-3xl font-black text-secondary md:text-4xl">{title}</h2>
      <Link href={href} className="rounded-full bg-primary px-4 py-2.5 text-sm text-white transition hover:bg-primary-strong">
        看全部
      </Link>
    </div>
  );
}
