'use client'

import { FRONTEND_URL } from '@/api/constants'
import { deriveBasePath } from '@/tech/url/basePath'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useRef } from 'react'

// Baked into the client bundle at build time; the server's /api/build-id returns
// the currently-deployed build's hash. A mismatch means a newer version shipped.
const INITIAL_HASH = process.env.NEXT_PUBLIC_BUILD_HASH
const POLL_INTERVAL_MS = 60_000

// Routes with unsaved user input: don't reload on tab refocus here (would lose
// their work) — only reload once they navigate away.
const EDIT_ROUTES = ['/vytvorit/napsat']

/**
 * App-wide auto-updater (no service worker). Polls the deployed build hash and,
 * when a newer version is live, reloads at the next *safe* moment so nothing is
 * lost: on route change (always safe — the user is leaving the page), or on tab
 * refocus when not sitting on an editing route. The user chose "safe automatic".
 */
export default function AppUpdater() {
	const pathname = usePathname()
	const { enqueueSnackbar } = useSnackbar()
	const t = useTranslations('common')

	const pendingRef = useRef(false)
	const reloadingRef = useRef(false)
	const pathnameRef = useRef(pathname)
	pathnameRef.current = pathname

	const reload = useCallback(() => {
		if (reloadingRef.current) return
		reloadingRef.current = true
		enqueueSnackbar(t('updatingVersion'), {
			variant: 'info',
			autoHideDuration: 2500,
		})
		// small delay so the toast is visible before the reload
		setTimeout(() => window.location.reload(), 800)
	}, [enqueueSnackbar, t])

	// detect a newer deployed build
	useEffect(() => {
		if (!INITIAL_HASH) return

		const url = `${deriveBasePath(FRONTEND_URL)}/api/build-id`

		const check = async () => {
			if (pendingRef.current) return
			try {
				const res = await fetch(url, { cache: 'no-store' })
				const { hash } = await res.json()
				if (hash && hash !== INITIAL_HASH) {
					pendingRef.current = true
					// apply immediately unless we're on an editing route
					if (!EDIT_ROUTES.includes(pathnameRef.current)) reload()
				}
			} catch {
				// network hiccups are non-critical — retry next interval
			}
		}

		const onVisible = () => {
			if (document.visibilityState === 'visible') {
				if (pendingRef.current) {
					if (!EDIT_ROUTES.includes(pathnameRef.current)) reload()
				} else {
					check()
				}
			}
		}

		const interval = setInterval(check, POLL_INTERVAL_MS)
		document.addEventListener('visibilitychange', onVisible)
		window.addEventListener('focus', onVisible)
		check()

		return () => {
			clearInterval(interval)
			document.removeEventListener('visibilitychange', onVisible)
			window.removeEventListener('focus', onVisible)
		}
	}, [reload])

	// a pending update becomes safe to apply the moment the route changes
	useEffect(() => {
		if (pendingRef.current) reload()
	}, [pathname, reload])

	return null
}
