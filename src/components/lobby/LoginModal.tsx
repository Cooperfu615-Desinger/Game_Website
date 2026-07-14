import { GlassModal } from './GlassModal';

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <GlassModal open={open} onClose={onClose} title="登入" titleId="lobby-login-title">
      <p className="mb-5 text-sm leading-6 text-fg-muted">登入遊戲大廳，繼續您的遊戲體驗。(原型示意)</p>
      <form className="space-y-4" aria-label="登入表單(原型,不會送出)" onSubmit={(event) => event.preventDefault()}>
        <label className="block space-y-2 text-sm font-bold text-fg">
          <span>帳號</span>
          <input
            data-autofocus
            name="account"
            type="text"
            placeholder="請輸入帳號"
            className="h-12 w-full rounded-xl border border-fg/15 bg-bg/45 px-4 text-base text-fg shadow-inner shadow-bg/30 outline-none backdrop-blur-md placeholder:text-fg-muted/70 focus:border-primary/80 focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <label className="block space-y-2 text-sm font-bold text-fg">
          <span>密碼</span>
          <input
            name="password"
            type="password"
            placeholder="請輸入密碼"
            className="h-12 w-full rounded-xl border border-fg/15 bg-bg/45 px-4 text-base text-fg shadow-inner shadow-bg/30 outline-none backdrop-blur-md placeholder:text-fg-muted/70 focus:border-primary/80 focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <button
          type="button"
          className="min-h-12 w-full rounded-xl bg-primary px-4 font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-bg">
          登入(原型示意)
        </button>
      </form>
    </GlassModal>
  );
}
