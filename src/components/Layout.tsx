import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-night text-pearl">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(111,63,181,.35),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(200,155,74,.22),transparent_25%),linear-gradient(160deg,#120821_0%,#2a1033_48%,#07040f_100%)]" />
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-oracle">AI Tarot Oracle</p>
          <h1 className="font-display text-2xl text-white">AI 塔罗牌抽牌解牌</h1>
        </div>
        <div className="rounded-full border border-oracle/40 px-3 py-1 text-xs text-oracle">78 张韦特牌库</div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-4 pb-12">{children}</div>
    </main>
  );
}
