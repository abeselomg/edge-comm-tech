"use client";

import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import { isDelayed, LEAVE_DELAY_MS, nextOpen, type TabEvent } from "./lang-tab-state";
import { isHydrated, pickInitialLang, STORAGE_KEY, swapEl, swapTree, type Lang } from "@/lib/i18n/swap";

/*
 * EN / አማ switch, kept in an edge tab on the right of the viewport.
 *
 * Collapsed, only a small arrow tab shows. Hover (mouse), keyboard focus or a
 * tap on touch slides the switch out; it folds away again a moment after the
 * pointer or focus leaves, on Escape, or on a tap elsewhere. The language
 * buttons (which follow the arrow in tab order) are visibility:hidden while collapsed, so they cannot be tabbed to
 * or read out until the tab is open.
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pressType = useRef("");
  const panelId = useId();

  // Pick the starting language once, after hydration.
  useEffect(() => {
    setLang(pickInitialLang(window.location.search, readStored()));
  }, []);

  // Apply whenever it changes.
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.lang = lang;
    // Swap what React has hydrated now, and keep trying for the rest: sections
    // inside a Suspense boundary hydrate a little later than the header.
    const sweep = () => {
      let waiting = 0;
      document.querySelectorAll<HTMLElement>("[data-am]").forEach((el) => {
        if (isHydrated(el)) swapEl(el, lang);
        else waiting += 1;
      });
      return waiting;
    };
    let timer: ReturnType<typeof setInterval> | undefined;
    if (sweep() > 0) {
      let tries = 0;
      timer = setInterval(() => {
        tries += 1;
        if (sweep() === 0 || tries >= 50) clearInterval(timer);
      }, 100);
    }
    if (lang !== "am") return () => clearInterval(timer);
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) swapTree(n, "am");
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [lang]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // A tap or click anywhere outside folds the tab away.
  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => {
      if (e.target instanceof Node && !rootRef.current?.contains(e.target)) send("outside");
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  function send(event: TabEvent) {
    clearTimeout(closeTimer.current);
    if (isDelayed(event)) {
      closeTimer.current = setTimeout(() => setOpen((o) => nextOpen(o, event)), LEAVE_DELAY_MS);
    } else {
      setOpen((o) => nextOpen(o, event));
    }
  }

  function onFocus(e: FocusEvent<HTMLDivElement>) {
    // Keyboard focus only: a mouse click focusing the button is not an "open" on its own.
    if (e.target.matches(":focus-visible")) send("focus");
  }

  function onBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) send("blur");
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Escape" || !open) return;
    send("escape");
    // Do not leave focus on a button that is about to be hidden.
    if (e.currentTarget.contains(document.activeElement)) {
      e.currentTarget.querySelector<HTMLButtonElement>("[aria-controls]")?.focus();
    }
  }

  function onHover(e: PointerEvent<HTMLDivElement>, event: "enter" | "leave") {
    if (e.pointerType === "mouse") send(event);
  }

  function choose(next: Lang) {
    setLang(next);
    store(next);
  }

  return (
    <div
      ref={rootRef}
      data-parity="lang-toggle"
      data-open={open}
      className="eg-langtab"
      onPointerEnter={(e) => onHover(e, "enter")}
      onPointerLeave={(e) => onHover(e, "leave")}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        aria-label="Language"
        aria-expanded={open}
        aria-controls={panelId}
        className="eg-langtab-btn"
        onPointerDown={(e) => {
          pressType.current = e.pointerType;
        }}
        onClick={() => {
          send(pressType.current === "touch" || pressType.current === "pen" ? "press-touch" : "press");
          pressType.current = "";
        }}
      >
        <svg viewBox="0 0 12 20" width="12" height="20" aria-hidden="true" focusable="false" className="eg-langtab-chevron">
          <path d="M9 3 3 10l6 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={panelId} role="group" aria-label="Language" className="eg-langtab-panel">
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
              className="eg-langtab-lang"
            >
              {o.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
