import { COURSES, SERVICES } from "../content.mjs";

/*
 * A catalogue, threaded on the dashed hop line the homepage uses for its
 * method — one of only two places that motif is allowed, since a motif on
 * every page stops being a motif.
 *
 * Each course carries the meta a prospective student actually sorts on:
 * duration, level, lesson count. Colour is keyed off the service the course
 * teaches, so the academy reads as an extension of the practice rather than
 * a separate business.
 */

const ACCENT = {
  "Datacenter Facility": "#0888c5",
  "Networks (LAN/WLAN)": "#2ba8de",
  Cybersecurity: "#056a9a",
  "NOC and SOC services": "#0b6fa8",
  "Unified Communications": "#c48a5a",
  "Voice / Data / Internet": "#2ba8de",
  "CCTV and Physical security": "#056a9a",
  "IT service / Desktop support": "#0888c5",
  "Professional services": "#c48a5a",
};
const colour = (c) => ACCENT[c.service] ?? "#0888c5";
const slugOf = (c) => SERVICES.find((s) => s.title === c.service)?.slug;

const LEVELS = [...new Set(COURSES.map((c) => c.level))];
const lkey = (l) => l.toLowerCase().replace(/[^a-z]+/g, "-");

const filterCss = `
${["all", ...LEVELS.map(lkey)].map((k) => `#l-${k}:checked~.lbar label[for=l-${k}]`).join(",")}{background:#0888c5;color:#fff;border-color:#0888c5}
${LEVELS.map((l) => `#l-${lkey(l)}:checked~.cat li:not(.v-${lkey(l)}){display:none}`).join("\n")}
`;

const totalLessons = COURSES.reduce((n, c) => n + c.lessons, 0);

export default {
  title: "Academy — Edge COMM-TECH",
  desc: "Training in the systems Edge designs and operates.",
  body: `  <main>
    <section class="relative overflow-hidden border-b border-rule bg-paper-2">
      <span class="pointer-events-none absolute -right-28 -top-40 h-[34rem] w-[34rem] rounded-full"
            style="background:radial-gradient(circle,#0888c524,transparent 70%)" aria-hidden="true"></span>
      <div class="relative mx-auto max-w-6xl px-6 pb-12 pt-16">
        <div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p class="eg-rise font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Academy</p>
            <h1 class="eg-rise mt-3 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]" style="--d:.06s">
              We teach <span class="text-gold">what we build</span>
            </h1>
            <p class="eg-rise mt-4 max-w-xl text-ink/75" style="--d:.12s">
              Every course maps to a service Edge delivers, and is taught by the engineers who
              deliver it. No course covers a platform we do not work on.
            </p>
          </div>

          <dl class="eg-rise grid w-full grid-cols-3 gap-px overflow-hidden rounded-2xl bg-rule lg:w-[26rem]" style="--d:.2s">
            <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-3xl text-gold">${COURSES.length}</dt>
              <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Courses</dd></div>
            <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-3xl text-gold">${totalLessons}</dt>
              <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Lessons</dd></div>
            <div class="bg-paper-2 px-5 py-5"><dt class="font-display text-3xl text-gold">${LEVELS.length}</dt>
              <dd class="mt-1 font-mono text-[9px] uppercase tracking-widest text-steel">Levels</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-6xl px-6 py-14">
      <style>${filterCss}</style>

      ${["all", ...LEVELS.map(lkey)]
        .map((k, i) => `<input class="sr-only" type="radio" name="level" id="l-${k}"${i === 0 ? " checked" : ""}>`)
        .join("")}

      <div class="lbar flex flex-wrap gap-2">
        <label for="l-all" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">All levels <span class="font-mono text-[10px] text-steel">${COURSES.length}</span></label>
        ${LEVELS.map(
          (l) =>
            `<label for="l-${lkey(l)}" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">${l} <span class="font-mono text-[10px] text-steel">${COURSES.filter((c) => c.level === l).length}</span></label>`,
        ).join("")}
      </div>

      <ol class="cat relative mt-12 space-y-4 pl-10">
        <span class="absolute left-[7px] top-4 h-[calc(100%-2rem)] w-px
                     bg-[repeating-linear-gradient(180deg,#0888c5_0_6px,transparent_6px_12px)]" aria-hidden="true"></span>
        ${COURSES.map(
          (c, i) => `
        <li class="eg-inview v-${lkey(c.level)} relative">
          <span class="absolute left-[-2.4rem] top-8 h-3 w-3 rounded-full ring-4 ring-paper"
                style="background:${colour(c)}" aria-hidden="true"></span>
          <a href="${c.slug === "soc" ? "course-soc.html" : "#"}"
             class="group block overflow-hidden rounded-2xl bg-paper-2 shadow-[0_16px_38px_-32px_rgb(28_36_48/0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_52px_-28px_rgb(8_136_197/0.45)]">
            <span class="block h-1" style="background:linear-gradient(90deg,${colour(c)},${colour(c)}22)"></span>
            <span class="flex flex-col gap-5 p-6 md:flex-row md:items-center">
              <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-lg transition-transform duration-300 group-hover:scale-110"
                    style="background:${colour(c)}16;color:${colour(c)}">${String(i + 1).padStart(2, "0")}</span>
              <span class="min-w-0 flex-1">
                <span class="inline-block rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest"
                      style="background:${colour(c)}1a;color:${colour(c)}">${c.service}</span>
                <span class="mt-2 block font-display text-2xl leading-tight group-hover:text-gold">${c.title}</span>
              </span>
              <span class="flex shrink-0 gap-5 font-mono text-[10px] uppercase tracking-widest text-steel">
                <span><span class="block text-base font-sans font-semibold normal-case tracking-normal text-ink">${c.duration}</span>Duration</span>
                <span><span class="block text-base font-sans font-semibold normal-case tracking-normal text-ink">${c.level}</span>Level</span>
                <span><span class="block text-base font-sans font-semibold normal-case tracking-normal text-ink">${c.lessons}</span>Lessons</span>
              </span>
            </span>
          </a>
        </li>`,
        ).join("")}
      </ol>

      <div class="eg-inview mt-14 overflow-hidden rounded-3xl text-paper"
           style="background:linear-gradient(120deg,#056a9a,#0888c5 55%,#2ba8de)">
        <div class="grid gap-8 p-9 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <p class="font-mono text-[10px] uppercase tracking-widest text-paper/70">Training for teams</p>
            <h2 class="mt-2 font-display text-3xl md:text-4xl">Run a course for your own engineers</h2>
            <p class="mt-3 max-w-xl text-paper/85">
              Any of these can be delivered on your site, against your own estate rather than a
              lab. Useful straight after a handover, when the people who will run the system are
              still learning it.
            </p>
          </div>
          <a href="contact.html"
             class="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5">
            Ask about on-site training &rarr;
          </a>
        </div>
      </div>
    </div>
  </main>`,
};
