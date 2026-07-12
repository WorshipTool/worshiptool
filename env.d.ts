// env.d.ts
declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_BACKEND_URL: string
		NEXT_PUBLIC_FRONTEND_URL: string
		NEXT_PUBLIC_FRONTEND_HOSTNAME: string

		NEXT_PUBLIC_TEMPORARILY_UNAVAILABLE?: 'true' | 'false' | undefined
		NEXT_PUBLIC_DISABLE_WEBSOCKETS?: 'true' | 'false' | undefined

		NEXT_PUBLIC_STATSIG_API_KEY: string
		STATSTIG_SERVER_SECRET_KEY: string

		NEXT_PUBLIC_AUTH_COOKIE_NAME?: string
		NEXT_PUBLIC_USE_SUBDOMAINS?: 'true' | 'false' // Handle by feature-flag
		TEST_WITH_SLOWDOWN?: 'true' | 'false' | undefined

		CONTENT_VERSION: string
		NEXT_PUBLIC_STRIPE_SUPPORT_URL: string
		NEXT_PUBLIC_IMPLEMENT_IDEA_URL: string

		// Sentry error tracking (disabled when NEXT_PUBLIC_SENTRY_DSN is not set)
		NEXT_PUBLIC_SENTRY_DSN?: string
		NEXT_PUBLIC_SENTRY_ENVIRONMENT?: string
		// Source maps upload during build (optional)
		SENTRY_ORG?: string
		SENTRY_PROJECT?: string
		SENTRY_AUTH_TOKEN?: string
	}
}
