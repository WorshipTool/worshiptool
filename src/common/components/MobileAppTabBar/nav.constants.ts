// Shared mobile-nav constants + route classification. Kept in a plain
// (non-'use client') module so both client components and server
// components/layouts can import them.

/** Width below which the mobile tab bar shows (and the top bar hides). */
export const MOBILE_NAV_BREAKPOINT = 700

/**
 * DOM id of the slot the tab bar renders directly above itself. Pages portal
 * their bottom-docked content (e.g. a paginator) into it so it stacks on top of
 * the bar via layout — no hard-coded bar height, and it follows automatically
 * if the bar's height ever changes.
 */
export const ABOVE_TABBAR_SLOT_ID = 'mobile-above-tabbar-slot'

/** Bottom clearance pages need so their content isn't hidden by the fixed bar
 * (accounts for the raised center action that pokes above the bar). */
export const MOBILE_NAV_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 80px)'

export type MobileTab = 'home' | 'songs' | 'account' | null

/**
 * Which bottom tab an "app" route maps to (null = not an app-shell route).
 * This is the single source of truth for the whole mobile app shell: the tab
 * bar's active state, whether the tab bar renders, and whether the top bar
 * hides on phones — so the top bar and tab bar always agree. Add app routes
 * here to bring them into the mobile shell.
 */
export function mobileTabForPath(pathname: string | null): MobileTab {
	if (!pathname) return null
	if (pathname === '/') return 'home'
	// songs list + a song detail page (/pisen/[hex]/[alias]), not its sub-routes
	if (pathname === '/seznam' || /^\/pisen\/[^/]+\/[^/]+\/?$/.test(pathname)) return 'songs'
	if (pathname === '/ucet' || pathname.startsWith('/ucet/')) return 'account'
	// playlist detail (/playlist/[guid]), not its sub-routes (prezentace / pdf)
	if (/^\/playlist\/[^/]+\/?$/.test(pathname)) return 'account'
	return null
}

/** True on the app-shell routes that show the bottom tab bar (top bar hidden on phones). */
export function isMobileTabBarRoute(pathname: string | null): boolean {
	return mobileTabForPath(pathname) !== null
}

/**
 * True for app-shell pages whose surface already pads for the bar/dock
 * itself. The tab bar skips its in-flow spacer there, so short content
 * doesn't become needlessly scrollable (no grey strip under the page).
 */
export function pageOwnsBottomClearance(pathname: string | null): boolean {
	if (!pathname) return false
	// song detail + playlist detail: overlay app-shell that owns its own clearance
	return (
		/^\/pisen\/[^/]+\/[^/]+\/?$/.test(pathname) ||
		/^\/playlist\/[^/]+\/?$/.test(pathname)
	)
}
