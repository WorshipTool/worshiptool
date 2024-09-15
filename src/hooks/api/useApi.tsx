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
	TeamEditingApi,
	TeamGettingApi,
	TeamJoiningApi,
	TeamMembersApi,
} from '@/api/generated'
import { useMemo } from 'react'
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
			teamEditingApi: new TeamEditingApi(apiConfiguration),
			teamJoiningApi: new TeamJoiningApi(apiConfiguration),
			teamMembersApi: new TeamMembersApi(apiConfiguration),
		}),
		[apiConfiguration]
	)

	// const apis = useMemo(() => {
	// 	const dict = apiClassesRecord

	// 	const apiClasses = Object.keys(dict).map((key) => {
	// 		const ApiClass = (dict as any)[key]
	// 		return new ApiClass(apiConfiguration)
	// 	})

	// 	return Object.fromEntries(
	// 		Object.keys(dict).map((key, index) => [key, apiClasses[index]])
	// 	)
	// }, [apiConfiguration])

	return apis
}
