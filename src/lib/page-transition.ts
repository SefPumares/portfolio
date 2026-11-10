/**
 * Coordination between vue-router and the Motion page transition.
 *
 * Route changes use `AnimatePresence mode="wait"`: the old page animates out, then the new
 * page animates in. The router's scrollBehavior waits for `pageExited()` so the old page
 * does not jump to the top while it is still fading out.
 */
let resolveExit: (() => void) | null = null
let exitPromise: Promise<void> | null = null

/** Called by the router before each navigation: the next exit animation is about to start. */
export function expectPageExit(): void {
  exitPromise = new Promise((resolve) => {
    resolveExit = resolve
  })
}

/** Called by AnimatePresence's exit-complete hook. */
export function notifyPageExited(): void {
  resolveExit?.()
  resolveExit = null
}

/**
 * Resolves when the outgoing page has finished animating, or after `timeoutMs` as a safety net
 * (e.g. reduced motion, where the exit may complete without an animation callback).
 */
export function pageExited(timeoutMs = 700): Promise<void> {
  const pending = exitPromise
  exitPromise = null
  if (!pending) return Promise.resolve()
  return Promise.race([pending, new Promise<void>((resolve) => setTimeout(resolve, timeoutMs))])
}

/**
 * Shared-element "fly" between a project card and its case-study page.
 * The card records its cover's viewport rectangle on click; the detail page reads it once
 * and animates its header cover from that rectangle into place (a FLIP animation).
 */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

let origin: { id: string; rect: Rect; at: number } | null = null

export function rememberCoverOrigin(id: string, el: Element): void {
  const r = el.getBoundingClientRect()
  origin = { id, rect: { x: r.left, y: r.top, width: r.width, height: r.height }, at: Date.now() }
}

/** Returns (and clears) the stored origin, only if it belongs to this project and is recent. */
export function takeCoverOrigin(id: string, maxAgeMs = 3000): Rect | null {
  const current = origin
  origin = null
  if (!current || current.id !== id || Date.now() - current.at > maxAgeMs) return null
  return current.rect
}
