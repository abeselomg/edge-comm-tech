export function Placeholder({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold-2">Coming from CMS</p>
      <h1 className="mt-3 font-display text-4xl">{title}</h1>
      <p className="mt-4 text-ink/80">{body}</p>
    </main>
  );
}
