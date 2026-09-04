"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { id?: string | null; label: string; href: string };

export function MobileNav({ nav, ctaHref, ctaLabel }: {
  nav: NavItem[];
  ctaHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation, so the panel never survives a route change.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="flex items-center gap-2 py-2 text-sm text-paper"
      >
        <span className="grid h-4 w-4 gap-[3px]" aria-hidden>
          <span className="block h-px w-full bg-brass" />
          <span className="block h-px w-full bg-brass" />
          <span className="block h-px w-full bg-brass" />
        </span>
        {open ? "Close" : "Menu"}
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 bottom-0 top-[var(--header-h,3.75rem)] z-40 overflow-y-auto bg-deep px-6 pb-10 pt-4"
        >
          <ul className="divide-y divide-rule-dark">
            {nav.map((item) => (
              <li key={item.id ?? item.href}>
                <Link
                  href={item.href}
                  className="display display-sm block py-4 text-paper"
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={ctaHref} className="btn btn-brass mt-8 w-full">
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
