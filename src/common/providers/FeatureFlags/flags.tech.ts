import { FeatureFlag } from '@/common/providers/FeatureFlags/flags.types'
import { ROLES, UserDto } from '@/interfaces/user'

import { StatsigClient, StatsigUser } from '@statsig/js-client'
// import dotenv from 'dotenv'
// dotenv.config()

export const userDtoToStatsigUser = (user: UserDto): StatsigUser => {
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

export const checkFlag = async (
	key: FeatureFlag,
	user?: UserDto
): Promise<boolean> => {
	const myStatsigClient = new StatsigClient(
		'client-GOgms4XNEEcqTZIdb8HglbeeQXITNSUPGQkOMD0nPFV',
		user ? userDtoToStatsigUser(user) : {}
	)

	await myStatsigClient.initializeAsync()

	return myStatsigClient.checkGate(key as string)
}
