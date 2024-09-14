'use server'

import { Configuration } from '@/api/generated'
import { getApiClasses } from '@/hooks/api/tech'
import { AUTH_COOKIE_NAME } from '@/hooks/auth/auth.constants'
import { UserDto } from '@/interfaces/user'
import { cookies } from 'next/headers'

export async function useServerApi() {
	// Get user info
	const cookie = cookies()
	const cookieData = cookie.get(AUTH_COOKIE_NAME)
	const user: UserDto | undefined = cookieData
		? JSON.parse(cookieData.value)
		: undefined

	// Create API configuration
	const apiConfiguration: Configuration = {
		isJsonMime: () => true,
		accessToken: user?.token,
	}

	// Return APIs
	const apis = getApiClasses(apiConfiguration)

	return apis
}
