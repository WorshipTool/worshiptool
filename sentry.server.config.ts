import * as Sentry from '@sentry/nextjs'

// Runs in the Node.js server runtime. Without NEXT_PUBLIC_SENTRY_DSN set,
// Sentry stays disabled and every capture call is a no-op.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
	// Error tracking only — tracing is tree-shaken in next.config.mjs.
	Sentry.init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		environment:
			process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
	})
}
