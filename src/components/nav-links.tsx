"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/*
 * Current-page marking needs the pathname, which is a client concern. Keeping
 * it to this component leaves the header, footer and every page a server
 * component -- the alternative is making the whole header client-side to
 * highlight one link.
 */
export function NavLinks({
  items,
  className,
  activeClass = "text-gold",
  idleClass = "text-ink/70 hover:text-gold",
}: {
  items: { label: string; href: string }[];
  className?: string;
  activeClass?: string;
  idleClass?: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        /*
         * The prefix test is what marks /solutions while the reader is on
         * /solutions/enterprise-network. The home link needs no special case:
         * its href is "/", so the test compares against "//", which no path
         * begins with, and home is marked only by the exact match.
         */
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`${className ?? ""} ${current ? activeClass : idleClass}`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
