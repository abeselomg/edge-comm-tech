import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { domains, getDomain } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return domains.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const domain = getDomain(slug);
  return { title: domain?.title ?? "Domain" };
}

export default async function DomainPage({ params }: Props) {
  const { slug } = await params;
  const domain = getDomain(slug);
  if (!domain) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/solutions" className="font-mono text-xs uppercase tracking-widest text-gold">
        ← All domains
      </Link>
      <p className="mt-6 font-mono text-xs text-gold">{domain.code}</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">{domain.title}</h1>
      <p className="mt-4 font-display text-xl normal-case tracking-normal text-gold">{domain.headline}</p>
      <p className="mt-6 text-lg text-ink/80">{domain.line}</p>
      <p className="mt-6 text-ink/80">{domain.body}</p>
      <Link
        href={`/contact?domain=${domain.slug}`}
        className="mt-10 inline-block bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-white"
      >
        Talk to an expert
      </Link>
    </main>
  );
}
