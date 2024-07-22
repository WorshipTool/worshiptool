import { AuthApiAxiosParamCreator } from '@/api/generated'
import { BASE_PATH } from '@/api/generated/base'
import { AUTH_COOKIE_NAME } from '@/hooks/auth/auth.constants'
import { UserDto } from '@/interfaces/user'
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
		return NextResponse.next()
	}

	const tokenCookie = cookies.get(AUTH_COOKIE_NAME)
	const user: UserDto | undefined = tokenCookie
		? JSON.parse(tokenCookie.value)
		: undefined
	const token = user?.token

	if (!token) return NextResponse.next()

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
		let response: NextResponse = NextResponse.redirect(
			new URL('/prihlaseni', request.url)
		)
		// Not redicert if the user is already on the login page
		if (request.nextUrl.pathname.startsWith('/prihlaseni')) {
			response = NextResponse.next()
		}

		response.cookies.set(AUTH_COOKIE_NAME, '', {
			expires: new Date(0),
		})

		return response
	}

	return NextResponse.next()
}

export const config = {
	// Exclude everything with dot in the path
	matcher: ['/((?!.*\\..*).*)'],
}
