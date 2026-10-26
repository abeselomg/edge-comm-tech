"use client";

import { useEffect, useState } from "react";
import { pickInitialLang, STORAGE_KEY, swapTree, type Lang } from "@/lib/i18n/swap";

/*
 * EN / አማ switch for the header.
 *
 * The server renders English and so does the first client render; the stored
 * or ?lang= choice is applied in an effect, after hydration, so there is no
 * markup difference to mismatch on. Applying a language sets <html lang> and
 * data-lang, swaps every <Tr> text under the page, and (while Amharic is on)
 * watches for nodes added later -- client-side navigation, streamed content --
 * and swaps those too.
 *
 * Storage is optional: both reads and writes are guarded, and the toggle works
 * for the visit without it.
 */

const OPTIONS: { lang: Lang; text: string; name: string; htmlLang: string }[] = [
  { lang: "en", text: "EN", name: "English", htmlLang: "en" },
  { lang: "am", text: "አማ", name: "አማርኛ", htmlLang: "am" },
];

function readStored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function store(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* private mode or blocked storage: the choice lasts for this visit only */
  }
}

export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en");

  // Pick the starting language once, after hydration.
  useEffect(() => {
    setLang(pickInitialLang(window.location.search, readStored()));
  }, []);

  // Apply whenever it changes.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.lang = lang;
    swapTree(document, lang);
    if (lang !== "am") return;
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) swapTree(n, "am");
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [lang]);

  function choose(next: Lang) {
    setLang(next);
    store(next);
  }

  return (
    <div
      data-parity="lang-toggle"
      role="group"
      aria-label="Language"
      className="flex shrink-0 items-center rounded-full border border-rule p-0.5 text-xs"
    >
      {OPTIONS.map((o) => {
        const on = lang === o.lang;
        return (
          <button
            key={o.lang}
            type="button"
            lang={o.htmlLang}
            aria-label={o.name}
            aria-pressed={on}
            onClick={() => choose(o.lang)}
            className={`rounded-full px-2.5 py-1 leading-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
              on ? "bg-gold text-white" : "text-ink/70 hover:text-gold"
            }`}
          >
            {o.text}
          </button>
        );
      })}
    </div>
  );
}
