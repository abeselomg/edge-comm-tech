import type { Metadata } from "next";
import { domains } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain: selected } = await searchParams;

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-gold">Contact</p>
      <h1 className="mt-3 font-display text-5xl">Talk to an expert</h1>
      <p className="mt-4 text-ink/80">Inquiry by solution domain — the same structure as the portfolio.</p>
      <form className="mt-10 space-y-5" action="#" method="post">
        <label className="block text-sm">
          Name
          <input
            name="name"
            required
            className="mt-1 w-full border border-rule bg-paper-2 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full border border-rule bg-paper-2 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          Domain
          <select
            name="domain"
            defaultValue={selected ?? ""}
            className="mt-1 w-full border border-rule bg-paper-2 px-3 py-2"
          >
            <option value="">Select a domain</option>
            {domains.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.code} {d.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Message
          <textarea name="message" rows={5} className="mt-1 w-full border border-rule bg-paper-2 px-3 py-2" />
        </label>
        <button
          type="submit"
          className="bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white"
        >
          Send inquiry
        </button>
      </form>
      <p className="mt-6 font-mono text-xs text-steel">Forms will route to email when Resend is wired.</p>
    </main>
  );
}
