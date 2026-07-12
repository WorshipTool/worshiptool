import * as Sentry from '@sentry/nextjs'

// Runs in the browser. Without NEXT_PUBLIC_SENTRY_DSN set,
// Sentry stays disabled and every capture call is a no-op.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
	// Error tracking only: performance tracing and session replay are
	// intentionally off (tracing is tree-shaken in next.config.mjs,
	// session replay is covered by Statsig/Hotjar).
	Sentry.init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		environment:
			process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
	})
}
