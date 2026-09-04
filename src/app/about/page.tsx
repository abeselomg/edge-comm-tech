import type { Metadata } from "next";
import { about, nextFramework, proof } from "@/lib/content";

export const metadata: Metadata = { title: "Company" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Company</p>
      <h1 className="mt-3 font-display text-5xl">What comes next</h1>
      <p className="mt-6 text-lg text-ink/80">{about.intro}</p>
      <p className="mt-6 text-ink/80">{about.commitment}</p>

      <div className="mt-10 grid grid-cols-3 border border-rule">
        {proof.map((item) => (
          <div key={item.label} className="border-r border-rule px-4 py-6 last:border-r-0">
            <p className="font-display text-2xl text-gold">{item.value}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-steel">{item.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 font-display text-3xl">What “next” means</h2>
      <ul className="mt-6 space-y-3 text-ink/80">
        {about.nextMeans.map((item) => (
          <li key={item} className="border-l-2 border-gold pl-4">
            {item}
          </li>
        ))}
      </ul>

      <h2 className="mt-14 font-display text-3xl">Navigate · Enable · eXceed · Transform</h2>
      <ol className="mt-6 grid gap-4">
        {nextFramework.map((step) => (
          <li key={step.title}>
            <span className="font-mono text-xs text-gold">{step.letter}</span>
            <span className="ml-2 font-display">{step.title}</span>
            <p className="mt-1 text-sm text-ink/75">{step.body}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 font-display text-3xl">Outcomes</h2>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-ink/80">
        {about.outcomes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </main>
  );
}
