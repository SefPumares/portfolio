/**
 * Scroll-triggered animations (Motion's whileInView) need IntersectionObserver. When it is
 * missing (very old browsers, jsdom in unit tests) content must render in its final state
 * instead of waiting forever at opacity 0.
 */
export const canAnimateInView = (): boolean => typeof IntersectionObserver !== 'undefined'
