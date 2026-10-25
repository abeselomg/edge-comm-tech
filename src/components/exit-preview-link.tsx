"use client";

import { usePathname } from "next/navigation";

/*
 * The pathname is a client concern (a layout cannot read the URL), and the
 * editor should land back on the page they were previewing. /preview/exit
 * re-checks the path, so nothing here needs to be trusted.
 *
 * A plain <a>, not next/link: leaving draft mode is a route handler that sets
 * a cookie and redirects, which wants a full navigation, not a prefetch.
 */
export function ExitPreviewLink() {
  const pathname = usePathname();
  const href = pathname ? `/preview/exit?path=${encodeURIComponent(pathname)}` : "/preview/exit";
  return (
    <a href={href} className="rounded-full bg-gold px-3 py-1 text-white underline-offset-2 hover:underline">
      Exit preview
    </a>
  );
}
