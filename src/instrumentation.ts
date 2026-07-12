import * as Sentry from '@sentry/nextjs'

export async function register() {
	if (process.env.NEXT_RUNTIME === 'nodejs') {
		await import('../sentry.server.config')
	}

	if (process.env.NEXT_RUNTIME === 'edge') {
		await import('../sentry.edge.config')
	}
}

// Next 15+ hook for RSC errors. On Next 14 it is never invoked — RSC
// errors are still captured via Sentry's build-time component wrapping.
export const onRequestError = Sentry.captureRequestError
