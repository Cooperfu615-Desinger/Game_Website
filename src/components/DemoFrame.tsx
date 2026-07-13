export function DemoFrame({ demoUrl, name }: { demoUrl?: string; name: string }) {
  if (!demoUrl) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-primary-strong/50 to-surface">
        <div className="text-center">
          <p className="text-3xl font-black text-white/90">{name}</p>
          <p className="mt-3 rounded-full bg-secondary/20 px-4 py-1 text-sm text-secondary">DEMO 即將推出</p>
        </div>
      </div>
    );
  }
  return (
    <iframe src={demoUrl} title={`${name} DEMO`} allow="fullscreen"
      className="aspect-video w-full rounded-2xl border border-white/5 bg-black" />
  );
}
