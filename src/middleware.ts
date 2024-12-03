import { FRONTEND_URL } from '@/api/constants'
import {
	AuthApiAxiosParamCreator,
	GetTeamAliasFromSubdomainOutDto,
	TeamGettingApiAxiosParamCreator,
} from '@/api/generated'
import { BASE_PATH } from '@/api/generated/base'
import { AUTH_COOKIE_NAME } from '@/hooks/auth/auth.constants'
import {
	COOKIES_SUBDOMAINS_PATHNAME_NAME,
	HEADERS_PATHNAME_NAME,
} from '@/hooks/pathname/constants'
import { UserDto } from '@/interfaces/user'
import { routesPaths } from '@/routes'
import {
	getReplacedUrlWithParams,
	shouldUseSubdomains,
} from '@/routes/routes.tech'
import { getSubdomains } from '@/routes/subdomains/subdomains.tech'
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
		return setResponse(NextResponse.next(), pathname)
	}

	// Check authentication
	const auth = await checkAuthentication(request)
	if (auth.response) return auth.response

	// Subdomains
	if (shouldUseSubdomains()) {
		const checkSub = await checkSubdomain(request, auth.user)
		if (checkSub !== true) return checkSub
	}

	const url = request.nextUrl.clone()
	const newPathname = await replaceTeamInSubPathname(url.pathname)
	if (newPathname !== url.pathname) {
		url.pathname = newPathname
		return setResponse(NextResponse.rewrite(url), newPathname)
	}

	return setResponse(NextResponse.next(), pathname)
}

const setResponse = async (
	response: NextResponse,
	pathname: string,
	subdomainsPrefixPathname?: string
): Promise<NextResponse> => {
	if (subdomainsPrefixPathname) {
		response.cookies.set(
			COOKIES_SUBDOMAINS_PATHNAME_NAME,
			subdomainsPrefixPathname
		)
	}

	response.headers.set(HEADERS_PATHNAME_NAME, pathname)

	return response
}

export const config = {
	// Exclude everything with dot in the path
	matcher: ['/((?!.*\\..*).*)'],
}

const checkSubdomain = async (
	request: NextRequest,
	user?: UserDto
): Promise<NextResponse | true> => {
	const url = request.nextUrl.clone()
	const host = request.headers.get('host')
	const subdomains = getSubdomains(host)
	if (subdomains.length > 0) {
		let pathname = ''

		for (const subdomain of subdomains) {
			const url = routesPaths['subdomain']
			const aPathname = getReplacedUrlWithParams(
				FRONTEND_URL + url,
				{ subdomain },
				{ subdomains: false, relative: true }
			)

			pathname = aPathname + pathname
		}

		url.pathname = pathname + url.pathname
		url.pathname = await replaceTeamInSubPathname(url.pathname)

		return setResponse(NextResponse.rewrite(url), pathname)
	}
	return true
}

const checkAuthentication = async (
	request: NextRequest
): Promise<{
	user?: UserDto | undefined
	response?: NextResponse
}> => {
	const { cookies } = request
	const tokenCookie = cookies.get(AUTH_COOKIE_NAME)
	let user: UserDto | undefined = undefined
	try {
		user = tokenCookie ? JSON.parse(tokenCookie.value) : undefined
	} catch (e) {}
	const token = user?.token

	if (!token) return {}

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
		const response: NextResponse = await setResponse(
			NextResponse.redirect(new URL('/prihlaseni', request.url)),
			'/prihlaseni'
		)
		response.cookies.set(AUTH_COOKIE_NAME, '', {
			expires: new Date(0),
			domain: `.${process.env.NEXT_PUBLIC_FRONTEND_HOSTNAME}`,
		})

		// Not redicert if the user is already on the login page
		const onLoginPage: boolean =
			request.nextUrl.pathname.startsWith('/prihlaseni')
		if (onLoginPage) {
			return { user }
		}

		return { user, response }
	}
	return { user }
}

const replaceTeamInSubPathname = async (pathname: string) => {
	const key = routesPaths.subdomain.split('/')[1]

	const getAlias = async (subdomain: string): Promise<string | null> => {
		const creator = TeamGettingApiAxiosParamCreator({
			isJsonMime: () => true,
		})
		const fetchData = await creator.teamGettingControllerGetAliasBySubdomain(
			subdomain
		)

		try {
			const url = BASE_PATH + fetchData.url
			const response = await fetch(url, { ...(fetchData.options as any) })
			if (response.status === 404) return null
			const result: GetTeamAliasFromSubdomainOutDto = await response.json()
			return result.alias
		} catch (e) {
			return null
		}
	}

	const parts = pathname.split('/').filter((part) => part !== '')
	if (parts.length < 2) return pathname

	if (parts[0] !== key) return pathname // Not a subdomain

	const alias = await getAlias(parts[1])
	if (!alias) return pathname

	const teamPathname = getReplacedUrlWithParams(
		routesPaths.team,
		{ alias },
		{
			subdomains: false,
		}
	)

	//replace the first two parts of the path with the team url

	const newPath = teamPathname + '/' + parts.slice(2).join('/')

	return newPath
}
