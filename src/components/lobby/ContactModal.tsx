import { company } from '@/data/company';
import { GlassModal } from './GlassModal';

export function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="聯絡我們"
      titleId="lobby-contact-title"
      maxWidth="max-w-2xl">
      <div className="grid gap-7 md:grid-cols-[0.85fr_1.15fr] md:gap-8">
        <section aria-label="聯絡資訊">
          <p className="mb-4 text-sm leading-6 text-fg-muted">歡迎留下訊息，或透過以下方式與我們聯繫。</p>
          <dl className="space-y-4 text-sm">
            <div className="rounded-xl border border-fg/10 bg-bg/25 px-4 py-3 backdrop-blur-md">
              <dt className="mb-1 font-bold text-primary-soft">Email</dt>
              <dd className="break-all text-fg">{company.contact.email}</dd>
            </div>
            <div className="rounded-xl border border-fg/10 bg-bg/25 px-4 py-3 backdrop-blur-md">
              <dt className="mb-1 font-bold text-primary-soft">電話</dt>
              <dd className="text-fg">{company.contact.phone}</dd>
            </div>
            <div className="rounded-xl border border-fg/10 bg-bg/25 px-4 py-3 backdrop-blur-md">
              <dt className="mb-1 font-bold text-primary-soft">地址</dt>
              <dd className="leading-6 text-fg">{company.contact.address}</dd>
            </div>
          </dl>
        </section>

        <form className="space-y-4" aria-label="聯絡表單(原型,不會送出)" onSubmit={(event) => event.preventDefault()}>
          <label className="block space-y-2 text-sm font-bold text-fg">
            <span>您的名稱</span>
            <input
              data-autofocus
              name="name"
              placeholder="請輸入名稱"
              className="h-12 w-full rounded-xl border border-fg/15 bg-bg/45 px-4 text-base text-fg shadow-inner shadow-bg/30 outline-none backdrop-blur-md placeholder:text-fg-muted/70 focus:border-primary/80 focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block space-y-2 text-sm font-bold text-fg">
            <span>Email</span>
            <input
              name="email"
              placeholder="請輸入 Email"
              type="email"
              className="h-12 w-full rounded-xl border border-fg/15 bg-bg/45 px-4 text-base text-fg shadow-inner shadow-bg/30 outline-none backdrop-blur-md placeholder:text-fg-muted/70 focus:border-primary/80 focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="block space-y-2 text-sm font-bold text-fg">
            <span>訊息內容</span>
            <textarea
              name="message"
              placeholder="請輸入訊息內容"
              className="min-h-28 w-full resize-y rounded-xl border border-fg/15 bg-bg/45 px-4 py-3 text-base text-fg shadow-inner shadow-bg/30 outline-none backdrop-blur-md placeholder:text-fg-muted/70 focus:border-primary/80 focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <button
            type="button"
            className="min-h-12 w-full rounded-xl bg-primary px-4 font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-bg">
            送出(原型示意)
          </button>
        </form>
      </div>
    </GlassModal>
  );
}
