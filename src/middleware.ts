import { FRONTEND_URL } from '@/api/constants'
import { AuthApiAxiosParamCreator } from '@/api/generated'
import { BASE_PATH } from '@/api/generated/base'
import { AUTH_COOKIE_NAME } from '@/hooks/auth/auth.constants'
import { COOKIES_SUBDOMAINS_PATHNAME_NAME } from '@/hooks/pathname/constants'
import { UserDto } from '@/interfaces/user'
import { getReplacedUrlWithParams, routesPaths } from '@/routes'
import { shouldUseSubdomains } from '@/routes/routes.tech'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const excludedPaths = ['/_next', '/static', '/manifest', '/public']

/**
 * This middleware checks if the user is authenticated.
 * All paths with dot in the path are excluded.
 * If the user is not authenticated, it redirects to the login page.
 */
export async function middleware(request: NextRequest) {
	const {
		cookies,
		nextUrl: { pathname },
	} = request

	// Check if the path is in the excluded paths
	if (excludedPaths.some((path) => pathname.startsWith(path))) {
		return setResponse(NextResponse.next())
	}

	// Check authentication
	const checkAuth = await checkAuthentication(request)
	if (checkAuth !== true) return checkAuth

	// Subdomains
	if (shouldUseSubdomains()) {
		const checkSub = await checkSubdomain(request)
		if (checkSub !== true) return checkSub
	}

	return setResponse(NextResponse.next())
}

const setResponse = (
	response: NextResponse,
	subdomainsPrefixPathname?: string
) => {
	if (subdomainsPrefixPathname) {
		response.cookies.set(
			COOKIES_SUBDOMAINS_PATHNAME_NAME,
			subdomainsPrefixPathname
		)
	}
	return response
}

export const config = {
	// Exclude everything with dot in the path
	matcher: ['/((?!.*\\..*).*)'],
}

export const checkSubdomain = async (
	request: NextRequest
): Promise<NextResponse | true> => {
	const url = request.nextUrl.clone()
	const host = request.headers.get('host')
	const subdomains = getSubdomains(host)
	if (subdomains.length > 0) {
		let pathname = ''

		for (const subdomain of subdomains) {
			const url = routesPaths['subdomain']
			const aWhole = getReplacedUrlWithParams(
				FRONTEND_URL + url,
				{ subdomain },
				{ subdomains: false }
			)

			const aUrl = new URL(aWhole)
			const a = aUrl.pathname

			pathname = a + pathname
		}

		url.pathname = pathname + url.pathname

		return setResponse(NextResponse.rewrite(url), pathname)
	}
	return true
}

export const checkAuthentication = async (
	request: NextRequest
): Promise<NextResponse | true> => {
	const { cookies } = request
	const tokenCookie = cookies.get(AUTH_COOKIE_NAME)
	const user: UserDto | undefined = tokenCookie
		? JSON.parse(tokenCookie.value)
		: undefined
	const token = user?.token

	if (!token) return true

	const creator = AuthApiAxiosParamCreator({
		isJsonMime: () => true,
		accessToken: token,
	})

	try {
		const fetchData = await creator.authControllerCheckTokenExpiration()
		const url = BASE_PATH + fetchData.url
		const result = await fetch(url, { ...(fetchData.options as any) })
		if (result.status === 401) throw new Error('Unauthorized')
	} catch (e) {
		let response: NextResponse = setResponse(
			NextResponse.redirect(new URL('/prihlaseni', request.url))
		)

		response.cookies.set(AUTH_COOKIE_NAME, '', {
			expires: new Date(0),
		})

		// Not redicert if the user is already on the login page
		if (request.nextUrl.pathname.startsWith('/prihlaseni')) {
			return true
		}

		return response
	}
	return true
}

export const getSubdomains = (host?: string | null) => {
	let subdomains: string[] = []
	if (!host && typeof window !== 'undefined') {
		// On client side, get the host from window
		host = window.location.host
	}
	if (host && host.includes('.')) {
		const parts = host.split('.')
		if (parts.length > 1) {
			// Valid candidate
			const local = parts.at(-1)?.includes('localhost')
			subdomains = parts.slice(0, local ? -1 : -2)
		}
	}
	return subdomains
}
