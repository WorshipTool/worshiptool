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

export type ApiClasses = ReturnType<typeof getInternalApiClasses>

export const getApiClasses = (apiConfiguration: Configuration) => {
	return getInternalApiClasses(apiConfiguration, wrapApi) as ApiClasses
}

export const getServerApiClasses = (apiConfiguration: Configuration) => {
	return getInternalApiClasses(apiConfiguration, wrapServerApi) as ApiClasses
}
const getInternalApiClasses = (
	apiConfiguration: Configuration,
	wrapFunc: typeof wrapApi
) => {
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

	const wrappedClasses = {
		playlistGettingApi: wrapFunc(playlistGettingApi, {
			getPlaylistDataByGuid: mapPlaylistDataOutDtoToPlaylistDto,
		}),
		playlistEditingApi: wrapFunc(playlistEditingApi, {
			addVariantToPlaylist: mapPlaylistItemOutDtoApiToPlaylistItemDto,
			createPlaylist: (r: any) => r.guid as PlaylistGuid,
		}),
		songGettingApi: wrapFunc(songGettingApi),
		songSearchingApi: wrapFunc(songSearchingApi, {
			search: (d: any) => d.map((i: any) => mapSearchSongPacksApiToDto(i)),
		}),
		songAddingApi: wrapFunc(songAddingApi),
		songEditingApi: wrapFunc(songEditingApi, {
			editVariant: (b) => b,
		}),
		songDeletingApi: wrapFunc(songDeletingApi, {}),
		songPublishingApi: wrapFunc(songPublishingApi),
		songValidationApi: wrapFunc(songValidationApi),
		songNotesApi: wrapFunc(songNotesApi, {}),
		songFavouritesApi: wrapFunc(songFavouritesApi),
		authApi: wrapFunc(authApi),
		permissionApi: wrapFunc(permissionApi),
		analyticsApi: wrapFunc(analyticsApi),
		mailApi: wrapFunc(mailApi),
		imagesApi: wrapFunc(imagesApi),
		bridgeApi: wrapFunc(bridgeApi),
		parserApi: wrapFunc(parserApi),
		packEmbeddingApi: wrapFunc(packEmbeddingApi, {
			search: (arr: any[]) =>
				arr.map((s: any) => ({
					found: [mapBasicVariantPackApiToDto(s)],
				})),
		}),
		songManagementApi: wrapFunc(songManagementApi),
		songUserManagementApi: wrapFunc(songUserManagementApi),
		messengerApi: wrapFunc(messengerApi),

		// submodules
		teamAddingApi: wrapFunc(teamAddingApi),
		teamGettingApi: wrapFunc(teamGettingApi),
		teamEditingApi: wrapFunc(teamEditingApi),
		teamJoiningApi: wrapFunc(teamJoiningApi),
		teamMembersApi: wrapFunc(teamMembersApi),
		teamEventsApi: wrapFunc(teamEventsApi),
		teamPlaylistsApi: wrapFunc(teamPlaylistsApi),
		teamSongNotesApi: wrapFunc(teamSongNotesApi),
		teamStatisticsApi: wrapFunc(teamStatisticsApi),
	}

	// console.log('wrapped songGettingApi', wrappedClasses.songGettingApi)

	return wrappedClasses
}

export const getApiClass = <T extends keyof ApiClasses>(
	className: T,
	apiConfiguration: Configuration
): ApiClasses[T] => {
	const classes = getApiClasses(apiConfiguration)
	if (className in classes) {
		return classes[className]
	} else {
		throw new Error(`API class ${className} does not exist`)
	}
}
