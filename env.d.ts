// env.d.ts
declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_BACKEND_URL: string
		NEXT_PUBLIC_FRONTEND_URL: string
		NEXT_PUBLIC_FRONTEND_HOSTNAME: string

		NEXT_PUBLIC_TEMPORARILY_UNAVAILABLE: 'true' | 'false' | undefined
		NEXT_PUBLIC_DONT_USE_SUBDOMAINS: 'true' | 'false' | undefined
		NEXT_PUBLIC_DISABLE_WEBSOCKETS: 'true' | 'false' | undefined

		NEXT_PUBLIC_CONFIGCAT_API_KEY: string
		NEXT_PUBLIC_CONFIGCAT_LABELS_API_KEY: string
	}
}
