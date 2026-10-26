"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * The gallery grid and its lightbox.
 *
 * The lightbox is a native <dialog> opened with showModal(), which gives the
 * accessible behaviour for free: the page behind is inert, Tab stays inside the
 * dialog, Esc closes it and focus returns to the picture that opened it. On top
 * of that the arrow keys step through the set and a click on the backdrop
 * closes. The dialog's content is only rendered while it is open, so a closed
 * gallery adds no hidden text or images to the page.
 */

export type GalleryItem = { src: string; alt: string; caption: string | null };

const arrow = (flip: boolean) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-5 w-5 ${flip ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const count = items.length;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const step = useCallback(
    (by: number) => setOpen((i) => (i === null ? i : (i + by + count) % count)),
    [count],
  );

  const close = () => {
    setOpen(null);
    opener.current?.focus();
  };

  const current = open === null ? null : items[open];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
        {items.map((item, i) => (
          <li key={`${item.src}-${i}`}>
            <figure className="m-0">
              <button
                type="button"
                aria-label={`Enlarge picture ${i + 1} of ${count}: ${item.alt}`}
                aria-haspopup="dialog"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setOpen(i);
                }}
                className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-paper-2 outline-offset-2 focus-visible:outline-2 focus-visible:outline-gold"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  data-parity="project-image"
                  fill
                  sizes="(min-width: 1024px) 380px, 50vw"
                  loading="lazy"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              </button>
              {item.caption ? (
                <figcaption className="mt-2 text-xs leading-snug text-steel">{item.caption}</figcaption>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Project pictures"
        onClose={() => setOpen(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            step(1);
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            step(-1);
          }
        }}
        className="eg-pimg-dialog m-auto max-h-[94vh] max-w-[94vw] overflow-visible rounded-2xl border-0 bg-transparent p-0 text-white backdrop:bg-black/80"
      >
        {current ? (
          <div className="relative flex flex-col items-center">
            <Image
              src={current.src}
              alt={current.alt}
              data-parity="project-image"
              width={1600}
              height={1000}
              sizes="94vw"
              className="max-h-[80vh] w-auto max-w-[94vw] rounded-xl object-contain"
            />
            <div className="mt-3 flex w-full max-w-3xl items-center justify-between gap-4 px-1 text-sm">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous picture"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
              >
                {arrow(true)}
              </button>
              <p className="min-w-0 flex-1 text-center leading-snug">
                {current.caption ? <span className="block">{current.caption}</span> : null}
                <span className="block font-mono text-[10px] uppercase tracking-widest text-white/70">
                  {`${(open ?? 0) + 1} / ${count}`}
                </span>
              </p>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next picture"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
              >
                {arrow(false)}
              </button>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close picture viewer"
              className="absolute -top-3 -right-3 grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-lg transition hover:bg-gold hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
