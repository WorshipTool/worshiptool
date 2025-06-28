'use server'

import { Configuration } from '@/api/generated'
import { getServerApiClasses } from '@/hooks/api/tech'
import { UserDto } from '@/interfaces/user'
import { getServerUser } from '@/tech/auth/getServerUser'

export async function useServerApi() {
	// Get user info
	const user: UserDto | undefined = getServerUser()

	// Create API configuration
	const apiConfiguration: Configuration = {
		isJsonMime: () => true,
		accessToken: user?.token,
	}

	// Return APIs
        const apis = getServerApiClasses(apiConfiguration)

	return apis
}
