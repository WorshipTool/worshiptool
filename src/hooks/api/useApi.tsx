import {
	AuthApi,
	GroupApi,
	PermissionsApi,
	PlaylistEditingApi,
	PlaylistGettingApi,
	SongAddingApi,
	SongDeletingApi,
	SongEditingApi,
	SongGettingApi,
} from '../../api/generated'
import useAuth from '../auth/useAuth'

export const useApi = () => {
	const { apiConfiguration, user } = useAuth()

	const apis = {
		playlistGettingApi: new PlaylistGettingApi(apiConfiguration),
		playlistEditingApi: new PlaylistEditingApi(apiConfiguration),
		songGettingApi: new SongGettingApi(apiConfiguration),
		songAddingApi: new SongAddingApi(apiConfiguration),
		songEditingApi: new SongEditingApi(apiConfiguration),
		songDeletingApi: new SongDeletingApi(apiConfiguration),
		groupApi: new GroupApi(apiConfiguration),
		authApi: new AuthApi(apiConfiguration),
		permissionApi: new PermissionsApi(apiConfiguration),
	}

	return apis
}
