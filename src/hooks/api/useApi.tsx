import {
	AnalyticsApi,
	AuthApi,
	BridgeApi,
	ImagesApi,
	MailApi,
	PackEmbeddingApi,
	ParserApi,
	PermissionsApi,
	PlaylistEditingApi,
	PlaylistGettingApi,
	SongAddingApi,
	SongDeletingApi,
	SongEditingApi,
	SongFavouritesApi,
	SongGettingApi,
	SongNotesApi,
	SongPublishingApi,
	SongValidationApi,
	TeamAddingApi,
	TeamEditingApi,
	TeamEventsApi,
	TeamGettingApi,
	TeamJoiningApi,
	TeamMembersApi,
	TeamPlaylistsApi,
	TeamSongNotesApi,
	TeamStatisticsApi,
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
			songNotesApi: new SongNotesApi(apiConfiguration),
			songFavouritesApi: new SongFavouritesApi(apiConfiguration),
			authApi: new AuthApi(apiConfiguration),
			permissionApi: new PermissionsApi(apiConfiguration),
			analyticsApi: new AnalyticsApi(apiConfiguration),
			mailApi: new MailApi(apiConfiguration),
			imagesApi: new ImagesApi(apiConfiguration),
			bridgeApi: new BridgeApi(apiConfiguration),
			parserApi: new ParserApi(apiConfiguration),
			packEmbeddingApi: new PackEmbeddingApi(apiConfiguration),

			// submodules
			teamAddingApi: new TeamAddingApi(apiConfiguration),
			teamGettingApi: new TeamGettingApi(apiConfiguration),
			teamEditingApi: new TeamEditingApi(apiConfiguration),
			teamJoiningApi: new TeamJoiningApi(apiConfiguration),
			teamMembersApi: new TeamMembersApi(apiConfiguration),
			teamEventsApi: new TeamEventsApi(apiConfiguration),
			teamPlaylistsApi: new TeamPlaylistsApi(apiConfiguration),
			teamSongNotesApi: new TeamSongNotesApi(apiConfiguration),
			teamStatisticsApi: new TeamStatisticsApi(apiConfiguration),
		}),
		[apiConfiguration]
	)

	return apis
}
