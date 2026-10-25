import { Crumb, PageHead, Pending } from "@/components/ui";
import { getContactDetails, getEvent, getEvents, getForm } from "@/lib/content";
import { loadOr404 } from "@/lib/load";
import { emailByLabel } from "@/lib/routes";
import {
  EventDetails,
  OtherEvents,
  ProgramList,
  RegistrationPanel,
} from "../event-parts";

/*
 * One template, the event pages.
 *
 * The content master supplies a single registration-form shape for all of them,
 * so the form is identical by design; the pages differ in status. A session that
 * has run renders as past with its registration closed. Status is derived from
 * the dates, so the page revalidates on a timer. A slug that is absent or
 * unpublished is a 404.
 */

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await getEvent(slug);
  return e ? { title: `${e.title} — Edge Comm-Tech`, description: e.intro } : {};
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await loadOr404(() => getEvent(slug));
  const past = e.status === "past";
  // A past event shows the closed state and never reads the form.
  const [all, contact, form] = await Promise.all([
    getEvents(),
    getContactDetails(),
    past ? null : getForm("event-registration"),
  ]);
  const accent = past ? "#5c6b76" : "#0888c5";

  return (
    <main>
      <PageHead
        eyebrow={`${e.category} · ${e.displayDate}`}
        title={e.headline}
        intro={e.intro}
        accent={accent}
        variant="beam"
        crumb={
          <Crumb
            trail={[
              { label: "Resources", href: "/resources" },
              { label: "Events", href: "/events" },
              { label: e.title },
            ]}
          />
        }
        meta={
          past ? (
            <p className="eg-rise mt-6">
              <Pending>This session has taken place — registration is closed</Pending>
            </p>
          ) : e.pendingNote ? (
            <p className="eg-rise mt-6">
              <Pending>{e.pendingNote}</Pending>
            </p>
          ) : null
        }
      />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <EventDetails event={e} />
        <ProgramList event={e} accent={accent} />
        <RegistrationPanel
          event={e}
          accent={accent}
          email={emailByLabel(contact, /sales/i)}
          form={form}
        />
        <OtherEvents events={all} currentSlug={slug} />
      </div>
    </main>
  );
}
