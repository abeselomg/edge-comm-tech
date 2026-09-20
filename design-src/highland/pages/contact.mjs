import { CONTACT } from "../content.mjs";

const field = (label, name, type = "text") => `
          <label class="block">
            <span class="font-mono text-[10px] uppercase tracking-widest text-steel">${label}</span>
            <input type="${type}" name="${name}" class="mt-2 w-full rounded-xl border border-rule bg-paper-2 px-4 py-3 text-sm" />
          </label>`;

export default {
  title: "Contact — Edge COMM-TECH",
  desc: "Reach Edge Communication Technologies in Addis Ababa.",
  body: `  <main class="mx-auto max-w-6xl px-6 py-20">
    <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Get in touch</p>
    <h1 class="mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
      Tell us what you need to build, secure or keep running
    </h1>
    <p class="mt-5 max-w-xl text-ink/75">An engineer replies, not a sales queue.</p>

    <div class="mt-14 grid gap-12 md:grid-cols-[1fr_20rem]">
      <form class="grid gap-5 sm:grid-cols-2">
        ${field("Your name", "name")}
        ${field("Organisation", "org")}
        ${field("Email", "email", "email")}
        ${field("Telephone", "phone", "tel")}
        <label class="block sm:col-span-2">
          <span class="font-mono text-[10px] uppercase tracking-widest text-steel">What do you need?</span>
          <textarea name="message" rows="6" class="mt-2 w-full rounded-xl border border-rule bg-paper-2 px-4 py-3 text-sm"></textarea>
        </label>
        <div class="sm:col-span-2">
          <button type="button" class="rounded-full bg-gold px-6 py-3 text-sm text-white">Send enquiry</button>
          <span class="ml-3 text-xs text-steel">Design only — this form does not submit.</span>
        </div>
      </form>

      <aside class="self-start rounded-3xl bg-paper-2 p-6 shadow-[0_20px_50px_-24px_rgb(8_136_197_/_0.45)]">
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">Office</p>
        <p class="mt-3 text-sm text-ink/80">${CONTACT.office.join("<br />")}</p>
        <p class="mt-6 font-mono text-[10px] uppercase tracking-widest text-gold">Telephone</p>
        <p class="mt-3 text-sm">${CONTACT.phones.map((p) => `<a class="text-gold" href="tel:${p.replace(/\s/g, "")}">${p}</a>`).join("<br />")}</p>
        <p class="mt-6 font-mono text-[10px] uppercase tracking-widest text-gold">Email</p>
        <p class="mt-3 text-sm">${CONTACT.emails.map((e) => `<a class="text-gold" href="mailto:${e}">${e}</a>`).join("<br />")}</p>
        <div class="mt-6 aspect-[4/3] rounded-xl border border-rule bg-paper" role="img" aria-label="Map placeholder"></div>
      </aside>
    </div>
  </main>`,
};
