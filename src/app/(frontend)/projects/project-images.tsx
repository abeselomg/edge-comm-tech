import Image from "next/image";
import { projectCover, projectGallery } from "@/lib/media";
import type { Project } from "@/payload-types";
import { GalleryLightbox } from "./gallery-lightbox";

/*
 * Project pictures.
 *
 * Everything here reads images through projectCover() / projectGallery(), the
 * approval gate in src/lib/media.ts, so an image whose approval was withdrawn
 * never renders even if a caller forgot to filter. Pictures carry their words
 * in alt attributes only: no heading, no label and no caption is added unless
 * an editor typed one.
 */

const accentOf = (hex?: string | null) => (hex && /^#[0-9a-f]{6}$/i.test(hex) ? hex : "#0888c5");

/**
 * A fixed-ratio frame holding the project's cover.
 *
 * With no approved cover it shows a tinted placeholder (when `fallback` is
 * true) or nothing (when it is false). The placeholder is decorative and has no
 * text, so a project without a picture reads exactly as it did before.
 */
export function ProjectCover({
  project,
  accent,
  sizes,
  ratio = "aspect-[16/10]",
  className = "",
  fallback = true,
  priority = false,
}: {
  project: Project;
  accent?: string | null;
  sizes: string;
  ratio?: string;
  className?: string;
  fallback?: boolean;
  priority?: boolean;
}) {
  const cover = projectCover(project);
  if (!cover && !fallback) return null;
  const c = accentOf(accent);
  return (
    <div className={`relative ${ratio} overflow-hidden bg-paper-2 ${className}`}>
      {cover ? (
        <Image
          src={cover.url}
          alt={cover.alt ?? ""}
          data-parity="project-image"
          fill
          sizes={sizes}
          className="object-cover"
          {...(priority ? { priority: true } : { loading: "lazy" as const })}
        />
      ) : (
        <div
          aria-hidden="true"
          className="eg-pimg-fallback absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${c}26, ${c}0a)`, color: c }}
        >
          <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
            <g fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1">
              <path d="M0 78 40 58l40 20 40-20 40 20" />
              <path d="M0 98 40 78l40 20 40-20 40 20" />
              <path d="M40 58V34l40-20 40 20v24" />
              <path d="M80 78V14" />
            </g>
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * The gallery: a uniform grid of identical crops, each opening a lightbox.
 * Renders nothing when no row has an approved image.
 */
export function ProjectGallery({ project }: { project: Project }) {
  const pictures = projectGallery(project);
  if (!pictures.length) return null;
  return (
    <section
      aria-label={`Pictures of ${project.title}`}
      data-parity="project-gallery"
      className="border-t border-rule bg-paper-2/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-14">
        <GalleryLightbox
          items={pictures.map(({ image, caption }) => ({
            src: image.url,
            alt: image.alt ?? "",
            caption,
          }))}
        />
      </div>
    </section>
  );
}
