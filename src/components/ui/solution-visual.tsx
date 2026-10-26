import Image from "next/image";
import { solutionArtSrc, SOLUTION_ART, type ArtManifest } from "@/lib/solution-art";
import { mix, SolutionScene } from "./solution-scenes";
import { TiltStage } from "./tilt-stage";

/*
 * The 3D-style illustration in a solution page's hero.
 *
 * A gradient panel in the family's accent holds either the real image from
 * public/solutions/art (when src/lib/solution-art.ts lists one for the slug)
 * or the hand-drawn isometric scene. Both get the same motion: the art floats,
 * its layers drift at different depths, a shadow breathes underneath, and on a
 * fine pointer it tilts toward the mouse. Decorative only: hidden from
 * assistive tech, no text, and the aspect ratio is reserved so nothing shifts.
 */

const IMG_W = 960;
const IMG_H = 800;

export function SolutionVisual({
  slug,
  accent,
  manifest = SOLUTION_ART,
  className = "",
}: {
  slug: string;
  accent: string;
  manifest?: ArtManifest;
  className?: string;
}) {
  const src = solutionArtSrc(slug, manifest);
  // Tint toward brand blue so a warm accent (power) still sits well on the navy panel.
  const tone = mix(accent, "#0888c5", 0.6);
  return (
    <div
      aria-hidden="true"
      className={`eg-sv pointer-events-none relative aspect-[6/5] w-full overflow-clip rounded-[2rem] ${className}`}
      style={
        {
          ["--eg-sv-a" as string]: accent,
          background: `radial-gradient(120% 90% at 70% 10%, ${tone}aa, transparent 60%), linear-gradient(150deg, #0a3d62 0%, ${tone} 58%, #2bb5c9 120%)`,
        } as React.CSSProperties
      }
    >
      <span className="eg-sv-orb eg-sv-orb-a" />
      <span className="eg-sv-orb eg-sv-orb-b" />
      <TiltStage className="eg-sv-stage">
        <div className="eg-sv-tilt">
          <div className="eg-sv-float">
            {src ? (
              <Image
                src={src}
                alt=""
                width={IMG_W}
                height={IMG_H}
                priority
                unoptimized={src.endsWith(".svg")}
                sizes="(min-width: 1024px) 28rem, 90vw"
                className="eg-sv-img"
              />
            ) : (
              <SolutionScene slug={slug} accent={accent} />
            )}
          </div>
        </div>
      </TiltStage>
    </div>
  );
}
