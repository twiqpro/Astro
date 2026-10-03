import type { ReactNode } from "react";
import BrandMark from "@/components/BrandMark";
import { withBasePath } from "@/lib/base-path";

export default function PolicyPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-cream text-ink">
      <header className="border-b border-gold/30">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <BrandMark href={withBasePath("/")} />
          <a
            href={withBasePath("/#request")}
            className="rounded-full bg-plum px-4 py-2 text-sm font-semibold text-gold-soft"
          >
            Request kundli
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">moolank.life</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-plum sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-ink/60">Last updated: {updated}</p>
        <div className="mt-8 space-y-5 text-base leading-relaxed text-ink/85 [&_h2]:pt-3 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-plum [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </main>
    </div>
  );
}
