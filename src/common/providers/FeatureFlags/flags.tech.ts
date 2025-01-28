import { FeatureFlag } from '@/common/providers/FeatureFlags/flags.types'
import { ROLES, UserDto } from '@/interfaces/user'
import * as configcat from 'configcat-js'
import { User } from 'configcat-js'

import dotenv from 'dotenv'
dotenv.config()

export const configcatApiKey = process.env.NEXT_PUBLIC_CONFIGCAT_API_KEY

export const checkFlag = async (key: FeatureFlag): Promise<boolean> => {
	const logger = configcat.createConsoleLogger(configcat.LogLevel.Error)

	const configCatClient = configcat.getClient(
		configcatApiKey,
		configcat.PollingMode.AutoPoll,
		{
			logger: logger,
		}
	)

	const ret = await configCatClient.getValueAsync(key as string, false)
	return ret
}

export const userDtoToConfigCatUser = (user: UserDto) => {
	const role = user.role === ROLES.Admin ? 'admin' : 'user'

	return new User(user.guid, user.email, 'Czech Republic', {
		role: role,
	})
}
