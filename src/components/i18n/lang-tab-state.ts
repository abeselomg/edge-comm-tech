/*
 * Open / closed logic for the language edge tab, kept apart from the component
 * so it can be tested without a DOM.
 *
 * - enter / focus  open it (pointer hover, keyboard focus)
 * - leave / blur   ask to close; the component waits a short hover-intent delay
 *                  before acting, so the tab does not flicker
 * - press          the arrow button was clicked or tapped. A mouse or keyboard
 *                  press opens (hover or focus already has), a touch or pen tap
 *                  toggles, since there is no hover to rely on.
 * - escape / outside  close at once
 */

export type TabEvent = "enter" | "focus" | "leave" | "blur" | "escape" | "outside" | "press-touch" | "press";

export const LEAVE_DELAY_MS = 250;

/** True when the event should close the tab after the hover-intent delay rather than now. */
export function isDelayed(event: TabEvent): boolean {
  return event === "leave" || event === "blur";
}

export function nextOpen(open: boolean, event: TabEvent): boolean {
  switch (event) {
    case "enter":
    case "focus":
    case "press":
      return true;
    case "press-touch":
      return !open;
    case "leave":
    case "blur":
    case "escape":
    case "outside":
      return false;
  }
}
