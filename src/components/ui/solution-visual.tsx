import Image from "next/image";
import { solutionArtSrc, SOLUTION_ART, type ArtManifest } from "@/lib/solution-art";
import { SolutionScene } from "./solution-scenes";
import { TiltStage } from "./tilt-stage";

/*
 * The 3D-style illustration in a solution page's hero.
 *
 * The art sits straight on the page background (no panel behind it: the
 * isometric platform in the art is the base). It is either the real image from
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
  return (
    <div
      aria-hidden="true"
      className={`eg-sv pointer-events-none relative aspect-[6/5] w-full overflow-clip ${className}`}
      style={{ ["--eg-sv-a" as string]: accent } as React.CSSProperties}
    >
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
