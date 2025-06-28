import {
	mapPlaylistDataOutDtoToPlaylistDto,
	mapPlaylistItemOutDtoApiToPlaylistItemDto,
} from '@/api/dtos/playlist/playlist.map'
import {
	AnalyticsApi,
	AuthApi,
	BridgeApi,
	Configuration,
	ImagesApi,
	MailApi,
	MessengerApi,
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
	SongManagementApi,
	SongNotesApi,
	SongPublishingApi,
	SongSearchingApi,
	SongUserManagementApi,
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

import { mapBasicVariantPackApiToDto } from '@/api/dtos'
import { mapSearchSongPacksApiToDto } from '@/api/dtos/song/song.search.dto'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { wrapApi, wrapServerApi } from './api-wrapper'

export type ApiClasses = ReturnType<typeof getApiClasses>

export const getApiClasses = (apiConfiguration: Configuration) => {
	const playlistGettingApi = new PlaylistGettingApi(apiConfiguration)
	const playlistEditingApi = new PlaylistEditingApi(apiConfiguration)
	const songGettingApi = new SongGettingApi(apiConfiguration)
	const songSearchingApi = new SongSearchingApi(apiConfiguration)
	const songAddingApi = new SongAddingApi(apiConfiguration)
	const songEditingApi = new SongEditingApi(apiConfiguration)
	const songDeletingApi = new SongDeletingApi(apiConfiguration)
	const songPublishingApi = new SongPublishingApi(apiConfiguration)
	const songValidationApi = new SongValidationApi(apiConfiguration)
	const songNotesApi = new SongNotesApi(apiConfiguration)
	const songFavouritesApi = new SongFavouritesApi(apiConfiguration)
	const authApi = new AuthApi(apiConfiguration)
	const permissionApi = new PermissionsApi(apiConfiguration)
	const analyticsApi = new AnalyticsApi(apiConfiguration)
	const mailApi = new MailApi(apiConfiguration)
	const imagesApi = new ImagesApi(apiConfiguration)
	const bridgeApi = new BridgeApi(apiConfiguration)
	const parserApi = new ParserApi(apiConfiguration)
	const packEmbeddingApi = new PackEmbeddingApi(apiConfiguration)
	const songManagementApi = new SongManagementApi(apiConfiguration)
	const songUserManagementApi = new SongUserManagementApi(apiConfiguration)
	const messengerApi = new MessengerApi(apiConfiguration)

	// submodules
	const teamAddingApi = new TeamAddingApi(apiConfiguration)
	const teamGettingApi = new TeamGettingApi(apiConfiguration)
	const teamEditingApi = new TeamEditingApi(apiConfiguration)
	const teamJoiningApi = new TeamJoiningApi(apiConfiguration)
	const teamMembersApi = new TeamMembersApi(apiConfiguration)
	const teamEventsApi = new TeamEventsApi(apiConfiguration)
	const teamPlaylistsApi = new TeamPlaylistsApi(apiConfiguration)
	const teamSongNotesApi = new TeamSongNotesApi(apiConfiguration)
	const teamStatisticsApi = new TeamStatisticsApi(apiConfiguration)

	return {
		playlistGettingApi: wrapApi(playlistGettingApi, {
			playlistGettingControllerGetPlaylistDataByGuid:
				mapPlaylistDataOutDtoToPlaylistDto,
		}),
		playlistEditingApi: wrapApi(playlistEditingApi, {
			playlistEditingControllerAddVariantToPlaylist:
				mapPlaylistItemOutDtoApiToPlaylistItemDto,
			playlistEditingControllerCreatePlaylist: (r: any) =>
				r.guid as PlaylistGuid,
		}),
		songGettingApi: wrapApi(songGettingApi),
		songSearchingApi: wrapApi(songSearchingApi, {
			songSearchingControllerSearch: (d: any) =>
				d.map((i: any) => mapSearchSongPacksApiToDto(i)),
		}),
		songAddingApi: wrapApi(songAddingApi),
		songEditingApi: wrapApi(songEditingApi),
		songDeletingApi: wrapApi(songDeletingApi),
		songPublishingApi: wrapApi(songPublishingApi),
		songValidationApi: wrapApi(songValidationApi),
		songNotesApi: wrapApi(songNotesApi),
		songFavouritesApi: wrapApi(songFavouritesApi),
		authApi: wrapApi(authApi),
		permissionApi: wrapApi(permissionApi),
		analyticsApi: wrapApi(analyticsApi),
		mailApi: wrapApi(mailApi),
		imagesApi: wrapApi(imagesApi),
		bridgeApi: wrapApi(bridgeApi),
		parserApi: wrapApi(parserApi),
		packEmbeddingApi: wrapApi(packEmbeddingApi, {
			packEmbeddingSearchControllerSearch: (arr: any[]) =>
				arr.map((s: any) => ({
					found: [mapBasicVariantPackApiToDto(s)],
				})),
		}),
		songManagementApi: wrapApi(songManagementApi),
		songUserManagementApi: wrapApi(songUserManagementApi),
		messengerApi: wrapApi(messengerApi),

		// submodules
		teamAddingApi: wrapApi(teamAddingApi),
		teamGettingApi: wrapApi(teamGettingApi),
		teamEditingApi: wrapApi(teamEditingApi),
		teamJoiningApi: wrapApi(teamJoiningApi),
		teamMembersApi: wrapApi(teamMembersApi),
		teamEventsApi: wrapApi(teamEventsApi),
		teamPlaylistsApi: wrapApi(teamPlaylistsApi),
		teamSongNotesApi: wrapApi(teamSongNotesApi),
		teamStatisticsApi: wrapApi(teamStatisticsApi),
	}
}

export const getServerApiClasses = (apiConfiguration: Configuration) => {
	const classes = getApiClasses(apiConfiguration)
	const wrapped: any = {}
	for (const [key, api] of Object.entries(classes)) {
		wrapped[key] = wrapServerApi(api as any)
	}
	return wrapped as ApiClasses
}
