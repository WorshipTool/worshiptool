// env.d.ts
declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_BACKEND_URL: string
		NEXT_PUBLIC_FRONTEND_URL: string
		NEXT_PUBLIC_FRONTEND_HOSTNAME: string

		NEXT_PUBLIC_TEMPORARILY_UNAVAILABLE: 'true' | 'false' | undefined
		NEXT_PUBLIC_DISABLE_WEBSOCKETS: 'true' | 'false' | undefined

		useSubdomains: 'true' | 'false' // Handle by feature-flag
	}
}
