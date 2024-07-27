export const shouldUseSubdomains = () =>
	process.env.NEXT_PUBLIC_DONT_USE_SUBDOMAINS !== 'true'
