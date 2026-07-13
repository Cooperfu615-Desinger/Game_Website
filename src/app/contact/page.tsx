import { company } from '@/data/company';
export const metadata = { title: `聯絡我們 | ${company.name}` };
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-28">
      <h1 className="mb-10 text-4xl font-black text-fg"><span className="mr-3 text-secondary">/</span>聯絡我們</h1>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-fg-muted">
          <p>Email:{company.contact.email}</p>
          <p>電話:{company.contact.phone}</p>
          <p>地址:{company.contact.address}</p>
        </div>
        <form className="space-y-4" aria-label="聯絡表單(原型,不會送出)">
          <input name="name" aria-label="您的名稱" className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-fg" placeholder="您的名稱" />
          <input name="email" aria-label="Email" className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-fg" placeholder="Email" type="email" />
          <textarea name="message" aria-label="訊息內容" className="h-28 w-full rounded-lg border border-white/10 bg-surface px-4 py-2.5 text-fg" placeholder="訊息內容" />
          <button type="button" className="w-full rounded-lg bg-primary py-2.5 font-bold text-white transition hover:bg-primary-strong">
            送出(原型示意)
          </button>
        </form>
      </div>
    </div>
  );
}
