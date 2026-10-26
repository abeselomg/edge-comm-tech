/*
 * The Edge loading mark: the logo's open ring and its node dot, redrawn as a
 * dial. An arc turns around a faint track, the large node on its head pulses,
 * and a hairline spoke joins it to the hub. Pure inline SVG; the motion lives
 * in the "eg-load-" block at the end of globals.css and uses only transform,
 * opacity and stroke-dashoffset. Under prefers-reduced-motion it holds still.
 *
 * role="status" with a visually hidden label, so assistive tech announces it
 * once. The label exists only while the loader is on screen -- it is never in
 * a finished page.
 */
export type EdgeLoaderSize = "sm" | "md" | "lg";

export const LOADER_SIZE_CLASS: Record<EdgeLoaderSize, string> = {
  sm: "h-6 w-6",
  md: "h-12 w-12",
  lg: "h-20 w-20",
};

export function EdgeLoader({
  size = "md",
  label = "Loading",
  className = "",
}: {
  size?: EdgeLoaderSize;
  label?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={`eg-load inline-flex text-gold ${LOADER_SIZE_CLASS[size]} ${className}`.trim()}
    >
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false" className="h-full w-full">
        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="5" opacity="0.14" />
        <g className="eg-load-orbit">
          <path
            className="eg-load-arc"
            d="M56 32A24 24 0 1 1 27.83 8.41"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
          />
          <path d="M32 32L27.83 8.41" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
          <circle cx="56" cy="32" r="2.6" fill="currentColor" />
          <circle className="eg-load-node" cx="27.83" cy="8.41" r="5.4" fill="currentColor" />
        </g>
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
