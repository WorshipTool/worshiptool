import {
	CloudNumber,
	FeatureFlag,
} from '@/common/providers/FeatureFlags/flags.types'
import { ROLES, UserDto } from '@/interfaces/user'
import { User } from 'configcat-js'
import * as configcat from 'configcat-js-ssr'

import dotenv from 'dotenv'
import { isDevelopment } from '../../../tech/development.tech'
dotenv.config()

export const configcatApiKey = process.env.NEXT_PUBLIC_CONFIGCAT_API_KEY

export const userDtoToConfigCatUser = (user: UserDto) => {
	const role = user.role === ROLES.Admin ? 'admin' : 'user'

	return new User(user.guid, user.email, 'Czech Republic', {
		role: role,
	})
}
const getLogger = () => {
	return isDevelopment
		? configcat.createConsoleLogger(configcat.LogLevel.Error)
		: undefined
}

export const checkFlag = async (key: FeatureFlag): Promise<boolean> => {
	const configCatClient = configcat.getClient(
		configcatApiKey,
		configcat.PollingMode.AutoPoll,
		{
			logger: getLogger(),
		}
	)

	const ret = await configCatClient.getValueAsync(key as string, false)
	return ret
}

export const getCloudNumber = async (
	key: CloudNumber,
	defaultValue: number
): Promise<number> => {
	const configCatClient = configcat.getClient(
		configcatApiKey,
		configcat.PollingMode.AutoPoll,
		{
			logger: getLogger(),
		}
	)

	const ret = await configCatClient.getValueAsync(key as string, defaultValue)
	return ret
}
