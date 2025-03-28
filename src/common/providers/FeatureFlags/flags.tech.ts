import { FeatureFlag } from '@/common/providers/FeatureFlags/flags.types'
import { ROLES, UserDto } from '@/interfaces/user'

import { StatsigClient, StatsigUser } from '@statsig/js-client'
// import dotenv from 'dotenv'
// dotenv.config()

export const userDtoToStatsigUser = (user?: UserDto): StatsigUser => {
	if (!user) {
		return {}
	}

	const role = user.role === ROLES.Admin ? 'admin' : 'user'

	return {
		userID: user.guid,
		email: user.email,
		custom: {
			role: role,
			name: user.firstName + ' ' + user.lastName,
		},
	}
}

const cache: Record<string, { value: boolean; expiresAt: number }> = {}
const CACHE_DURATION_MS = 60 * 1000 // 1 minuta
//TODO: is cache really needed? Its better with cache?

const getFlagWithCache = (key: FeatureFlag, user?: UserDto): boolean | null => {
	// Zkontroluj cache
	const cacheKey = `${key}-${user?.guid || 'global'}`
	const cached = cache[cacheKey]

	if (cached && cached.expiresAt > Date.now()) {
		return cached.value
	}
	return null
}

const saveFlagToCache = (
	key: FeatureFlag,
	value: boolean,
	user?: UserDto
): void => {
	const cacheKey = `${key}-${user?.guid || 'global'}`
	cache[cacheKey] = {
		value,
		expiresAt: Date.now() + CACHE_DURATION_MS,
	}
}

export const checkFlag = async (
	key: FeatureFlag,
	user?: UserDto
): Promise<boolean> => {
	const cachedValue = getFlagWithCache(key, user)
	if (cachedValue !== null) return cachedValue

	const myStatsigClient = new StatsigClient(
		'client-GOgms4XNEEcqTZIdb8HglbeeQXITNSUPGQkOMD0nPFV',
		user ? userDtoToStatsigUser(user) : {}
	)

	await myStatsigClient.initializeAsync()

	const value = myStatsigClient.checkGate(key as string)

	saveFlagToCache(key, value, user)

	return value
}
