// Shared mobile-nav constants. Kept in a plain (non-'use client') module so
// both client components and server components/layouts can import them.

/** Width below which the mobile tab bar shows (and the top bar hides). */
export const MOBILE_NAV_BREAKPOINT = 700

/** Bottom clearance pages need so their content isn't hidden by the fixed bar. */
export const MOBILE_NAV_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 72px)'

/**
 * CSS (server-rendered, so no post-hydration flash) that hides the fixed top
 * bar on phones — used by app pages/layouts that show the bottom tab bar
 * instead. Also emitted from route layouts so it covers loading fallbacks.
 */
export const HIDE_TOPBAR_ON_MOBILE_CSS = `@media (max-width:${
	MOBILE_NAV_BREAKPOINT - 0.05
}px){.wt-topbar-fixed{display:none!important}}`
