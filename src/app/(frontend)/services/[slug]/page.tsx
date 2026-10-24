import { ClosingCta, Crumb, PageHead } from "@/components/ui";
import { getService, getServices } from "@/lib/content";
import { loadOr404 } from "@/lib/load";
import { OtherServices, RelatedServices, ServiceBody } from "../service-parts";

/*
 * One template, six service pages. A slug that is absent or unpublished is a
 * 404, and the page is prerendered for every published slug.
 */

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getService(slug);
  return s ? { title: `${s.title} — Edge Comm-Tech`, description: s.blurb } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await loadOr404(() => getService(slug));
  const all = await getServices();

  return (
    <main>
      <PageHead
        eyebrow={`Service ${String(s.order).padStart(2, "0")} of ${all.length}`}
        title={s.headline}
        intro={s.intro}
        accent={s.accent}
        variant="beam"
        crumb={
          <Crumb
            trail={[
              { label: "Solutions", href: "/solutions" },
              { label: "Services", href: "/services" },
              { label: s.short },
            ]}
          />
        }
      />

      <div className="mx-auto max-w-4xl px-6 py-16">
        <ServiceBody service={s} />
        <RelatedServices related={s.related ?? []} accent={s.accent} />
      </div>

      <ClosingCta
        title="Tell us what you need to deliver"
        body="Share the requirement, the constraints and the environment you already run. We will say what we would do, in what order, and what it depends on."
        primary={{ href: "/contact", label: "Request a service consultation" }}
        secondary={{ href: "/projects", label: "View projects and success stories" }}
        accent={s.accent}
      />

      <section className="border-t border-rule bg-paper-2">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
            The other five services
          </p>
          <OtherServices services={all} currentSlug={slug} />
        </div>
      </section>
    </main>
  );
}
