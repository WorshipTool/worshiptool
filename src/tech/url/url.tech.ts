export const isUrlAbsolute = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url)
		return !!parsedUrl.origin
	} catch {
		return false
	}
}
