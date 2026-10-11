/*
 * Placeholder. Phase 4 Task 1 replaces this with Highland's homepage.
 *
 * It exists so the app has a route and `next build` stays green while the
 * schema is replaced underneath it. It reads nothing from the CMS on purpose:
 * the collections it would read are being rebuilt.
 */
export default function HomePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">
        Edge Comm-Tech
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight">
        Content model rebuild in progress
      </h1>
      <p className="mt-5 text-ink/75">
        The approved content is being moved into the CMS. The reviewable site
        remains the Highland build.
      </p>
    </main>
  );
}
