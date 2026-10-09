import { NEWS } from "../editorial.mjs";
import { pageHead, crumb, closingCta, pending, esc } from "../ui.mjs";

/*
 * News and announcements.
 *
 * Three approved records. One is a 2018 milestone kept deliberately in an
 * archive band rather than presented as current news; one is undated and says
 * so instead of carrying a plausible-looking date.
 */

const current = NEWS.filter((n) => !n.archive);
const archive = NEWS.filter((n) => n.archive);

const row = (n, lead = false) => {
  const unknown = /confirm/i.test(n.date);
  return `<li><a href="news-${n.slug}.html"
          class="eg-inview group grid gap-x-10 gap-y-3 border-t border-rule py-9 lg:grid-cols-[9rem_1fr]">
          <div class="shrink-0">
            <span class="block font-mono text-[10px] uppercase tracking-widest text-gold">${esc(n.kind)}</span>
            <span class="mt-1.5 block text-xs text-steel">${unknown ? pending("Date to confirm") : esc(n.date)}</span>
          </div>
          <div class="min-w-0">
            <h${lead ? 2 : 3} class="font-display ${lead ? "text-[clamp(1.4rem,2.6vw,2rem)]" : "text-[clamp(1.2rem,2vw,1.5rem)]"} leading-snug group-hover:text-gold">${esc(n.title)}</h${lead ? 2 : 3}>
            <p class="mt-2.5 max-w-2xl text-sm leading-relaxed text-ink/70">${esc(n.standfirst)}</p>
            <span class="mt-4 inline-block font-mono text-[10px] uppercase tracking-widest text-gold">Read the announcement &rarr;</span>
          </div>
        </a></li>`;
};

export default {
  title: "News and Announcements — Edge Comm-Tech",
  desc: "Company milestones, strategic updates, partnership and project announcements, and perspectives on Ethiopia's digital transformation from Edge Comm-Tech.",
  body: `  <main>
    ${pageHead({
      eyebrow: "News and announcements",
      title: "What is happening at Edge Comm-Tech",
      intro: "Company milestones, strategic updates, partnerships, project announcements, participation in national technology initiatives, and perspectives on Ethiopia's digital transformation.",
      accent: "#0b6fa8",
      variant: "rule",
      crumb: crumb([{ label: "Resources", href: "resources.html" }, { label: "News" }]),
    })}

    <div class="mx-auto max-w-6xl px-6 py-16">
      <ul>
        ${current.map((n, i) => row(n, i === 0)).join("\n        ")}
      </ul>

      ${
        archive.length
          ? `<section class="mt-16 rounded-3xl bg-paper-2 p-8 sm:p-10">
        <p class="font-mono text-[10px] uppercase tracking-widest text-steel">From the archive</p>
        <h2 class="mt-2 font-display text-[clamp(1.3rem,2.4vw,1.8rem)]">Earlier milestones</h2>
        <ul class="mt-6 divide-y divide-rule">
          ${archive
            .map(
              (n) => `<li><a href="news-${n.slug}.html" class="group grid gap-x-8 gap-y-1.5 py-5 lg:grid-cols-[6rem_1fr]">
            <span class="font-mono text-[10px] uppercase tracking-widest text-steel">${esc(n.date)}</span>
            <span class="min-w-0">
              <span class="block font-display text-base leading-snug group-hover:text-gold">${esc(n.title)}</span>
              <span class="mt-1.5 block max-w-2xl text-[13px] leading-relaxed text-ink/65">${esc(n.standfirst)}</span>
            </span>
          </a></li>`,
            )
            .join("\n          ")}
        </ul>
      </section>`
          : ""
      }

      <div class="mt-14 grid gap-3 sm:grid-cols-2">
        <a href="media-press-releases.html" class="eg-inview flex items-center justify-between gap-4 rounded-2xl border border-rule px-6 py-5 transition hover:border-gold hover:text-gold">
          <span class="font-display text-base">Press releases</span>
          <span class="font-mono text-[10px] uppercase tracking-widest text-steel">Publishing soon</span>
        </a>
        <a href="media-coverage.html" class="eg-inview flex items-center justify-between gap-4 rounded-2xl border border-rule px-6 py-5 transition hover:border-gold hover:text-gold">
          <span class="font-display text-base">Media coverage</span>
          <span class="font-mono text-[10px] uppercase tracking-widest text-steel">Publishing soon</span>
        </a>
      </div>
    </div>

    ${closingCta({
      title: "Press and media enquiries",
      body: "For interviews, statements, company information or media assets, contact our team and we will respond with the appropriate material.",
      primary: { href: "contact.html", label: "Contact the team" },
      secondary: { href: "subscribe.html", label: "Subscribe for updates" },
      accent: "#0b6fa8",
    })}
  </main>`,
};
