import { PARTNERS, AREAS } from "../content.mjs";

const count = (k) => PARTNERS.filter((p) => p.areas.includes(k)).length;

/* Radio + sibling selectors, no script, so the file stays standalone. */
const filterCss = `
${["all", ...AREAS.map(([k]) => k)]
  .map((k) => `#f-${k}:checked~.fbar label[for=f-${k}]`)
  .join(",")}{background:#0888c5;color:#fff;border-color:#0888c5}
${AREAS.map(([k]) => `#f-${k}:checked~.matrix tr:not(.c-${k}){opacity:.2}`).join("\n")}
`;

export default {
  title: "Partners — Edge COMM-TECH",
  desc: "The manufacturers Edge builds on, and what we deliver with each.",
  body: `  <main class="mx-auto max-w-6xl px-6 py-20">
    <style>${filterCss}</style>

    <p class="font-mono text-[11px] uppercase tracking-[0.28em] text-gold">Partner network</p>
    <h1 class="mt-3 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]">
      Eight manufacturers, one point of contact
    </h1>
    <p class="mt-5 max-w-2xl text-ink/75">
      Edge holds the partner relationship, so escalation, firmware and lifecycle support
      run through one team rather than eight.
    </p>

    ${["all", ...AREAS.map(([k]) => k)]
      .map((k, i) => `<input class="sr-only" type="radio" name="area" id="f-${k}"${i === 0 ? " checked" : ""}>`)
      .join("\n    ")}

    <div class="fbar mt-12 flex flex-wrap gap-2">
      <label for="f-all" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">All <span class="font-mono text-[10px] text-steel">${PARTNERS.length}</span></label>
      ${AREAS.map(([k, label]) => `<label for="f-${k}" class="cursor-pointer rounded-full border border-rule bg-paper-2 px-4 py-2 text-sm">${label} <span class="font-mono text-[10px] text-steel">${count(k)}</span></label>`).join("\n      ")}
    </div>

    <div class="matrix mt-10 overflow-x-auto">
      <table class="w-full min-w-[42rem] border-collapse text-left">
        <thead>
          <tr class="border-b border-gold">
            <th class="py-3 pr-4 font-mono text-[10px] uppercase tracking-widest text-steel">Manufacturer</th>
            ${AREAS.map(([, label]) => `<th class="py-3 px-3 font-mono text-[10px] uppercase tracking-widest text-steel">${label}</th>`).join("\n            ")}
          </tr>
        </thead>
        <tbody>
          ${PARTNERS.map((p) => `
          <tr class="${p.areas.map((a) => "c-" + a).join(" ")} border-b border-rule transition-opacity">
            <td class="py-4 pr-4 font-display text-lg">${p.name}</td>
            ${AREAS.map(([k]) => `<td class="px-3 py-4">${
              p.areas.includes(k)
                ? '<span class="inline-block h-2.5 w-2.5 rounded-full bg-gold"></span>'
                : '<span class="inline-block h-px w-3 bg-rule"></span>'
            }</td>`).join("\n            ")}
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <p class="mt-4 text-xs text-steel">
      Several partners cover more than one area, so the counts add to more than eight.
    </p>

    <section class="mt-24 grid gap-10 border-t border-rule pt-14 md:grid-cols-3">
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">01</p>
        <h3 class="mt-2 font-display text-2xl">Specified against the requirement</h3>
        <p class="mt-3 text-sm text-ink/75">The platform is chosen because it fits the brief and the site, not because of where the margin sits.</p>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">02</p>
        <h3 class="mt-2 font-display text-2xl">Certified on what we deploy</h3>
        <p class="mt-3 text-sm text-ink/75">The people specifying the design are the people who configure it.</p>
      </div>
      <div>
        <p class="font-mono text-[10px] uppercase tracking-widest text-gold">03</p>
        <h3 class="mt-2 font-display text-2xl">Supported after handover</h3>
        <p class="mt-3 text-sm text-ink/75">Partner status means direct escalation to the manufacturer and lifecycle visibility on firmware and end-of-support dates.</p>
      </div>
    </section>
  </main>`,
};
