import { HEADERS_PATHNAME_NAME } from '@/hooks/pathname/constants'
import { headers } from 'next/headers'

export const useServerPathname = (): string => {
	const h = headers()
	return h.get(HEADERS_PATHNAME_NAME) || ''
}
