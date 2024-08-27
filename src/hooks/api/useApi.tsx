import { useMemo } from 'react'
import {
	AnalyticsApi,
	AuthApi,
	GroupApi,
	MailApi,
	PermissionsApi,
	PlaylistEditingApi,
	PlaylistGettingApi,
	SongAddingApi,
	SongDeletingApi,
	SongEditingApi,
	SongGettingApi,
	SongPublishingApi,
	SongValidationApi,
	TeamAddingApi,
	TeamGettingApi,
} from '../../api/generated'
import useAuth from '../auth/useAuth'

export const useApi = () => {
	const { apiConfiguration } = useAuth()

	const apis = useMemo(
		() => ({
			playlistGettingApi: new PlaylistGettingApi(apiConfiguration),
			playlistEditingApi: new PlaylistEditingApi(apiConfiguration),
			songGettingApi: new SongGettingApi(apiConfiguration),
			songAddingApi: new SongAddingApi(apiConfiguration),
			songEditingApi: new SongEditingApi(apiConfiguration),
			songDeletingApi: new SongDeletingApi(apiConfiguration),
			songPublishingApi: new SongPublishingApi(apiConfiguration),
			songValidationApi: new SongValidationApi(apiConfiguration),
			groupApi: new GroupApi(apiConfiguration),
			authApi: new AuthApi(apiConfiguration),
			permissionApi: new PermissionsApi(apiConfiguration),
			analyticsApi: new AnalyticsApi(apiConfiguration),
			mailApi: new MailApi(apiConfiguration),

			// submodules
			teamAddingApi: new TeamAddingApi(apiConfiguration),
			teamGettingApi: new TeamGettingApi(apiConfiguration),
		}),
		[apiConfiguration]
	)

	return apis
}
