'use client'

import { useSyncExternalStore } from 'react'

/**
 * Whether the phone's full-screen search layer is open.
 *
 * The tab bar needs this to light up the search tab, but it cannot read it from
 * the URL: home writes an empty `?hledat=` on every visit (HomeDesktop's change
 * delayer deliberately syncs empty values so a cleared box doesn't leave a stale
 * query behind), so the param's presence says nothing about whether search is
 * actually open. Search is also a layer rather than a route, so the pathname
 * can't answer either.
 *
 * A tiny module-level store keeps the screen that owns the layer and the bar
 * that reflects it in sync, without threading state through the app tree.
 */
let open = false
const listeners = new Set<() => void>()

export function setMobileSearchOpen(next: boolean) {
	if (open === next) return
	open = next
	listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

/** Server snapshot is always false: the layer only ever opens client-side. */
export function useMobileSearchOpen() {
	return useSyncExternalStore(
		subscribe,
		() => open,
		() => false
	)
}
