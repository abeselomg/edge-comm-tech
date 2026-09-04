import type { Metadata } from "next";
import { sectors } from "@/lib/content";

export const metadata: Metadata = { title: "Sectors" };

export default function ClientsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Who we serve</p>
      <h1 className="mt-3 font-display text-5xl">Trusted across critical sectors</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/80">
        From government and finance to telecom and international organizations, we partner where technology reliability
        isn’t optional.
      </p>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {sectors.map((s) => (
          <li key={s.slug} className="border-l-4 border-gold bg-paper-2 px-6 py-6">
            <h2 className="font-display text-2xl">{s.title}</h2>
            <p className="mt-2 text-ink/75">{s.line}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
