/*
 * One import path for the ported primitives, so a page writes
 * `from "@/components/ui"` rather than four relative paths.
 *
 * Fourteen components: the eleven in design-src/highland/ui.mjs that produce
 * markup, plus CapCard, which Highland built inline in the pages that needed
 * it. Highland's esc() has no counterpart -- React escapes by default.
 */
export { CtaRow, Crumb, PageHead, type Cta, type HeadVariant } from "./page-head";
export { ClosingCta, Eyebrow, SectionHead } from "./section";
export { CapCard, CheckList, NumberedSteps } from "./lists";
export { Confirmable, Mark, Pending, type ConfirmableValue, type MarkItem } from "./markers";
