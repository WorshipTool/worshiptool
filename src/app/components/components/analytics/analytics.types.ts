import { VariantPackGuid } from '@/api/dtos'

export const AnalyticsTrackEventNames: Record<AnalyticsEventNameType, string> =
	{
		VISIT_SONG: 'VISIT_SONG',
		SMART_SEARCH_TOGGLE: 'SMART_SEARCH_TOGGLE',
		SEARCH: 'SEARCH',
		LOGIN: 'LOGIN',
		SIGNUP: 'SIGNUP',
		LOGOUT: 'LOGOUT',
		CREATE_PLAYLIST: 'CREATE_PLAYLIST',
		ADD_SONG_TO_PLAYLIST: 'ADD_SONG_TO_PLAYLIST',
		REMOVE_SONG_FROM_PLAYLIST: 'REMOVE_SONG_FROM_PLAYLIST',
	}

export type AnalyticsTrackData = {
	VISIT_SONG: {
		songGuid: string
		packGuid: VariantPackGuid
		title: string
		hasChords: boolean
	}
	SMART_SEARCH_TOGGLE: {
		enabled: boolean
	}
	SEARCH: {
		query: string
		smartSearch: boolean
	}
	LOGIN: {
		method: 'password' | 'google'
	}
	SIGNUP: {
		method: 'password'
	}
	LOGOUT: {}
	CREATE_PLAYLIST: {}
	ADD_SONG_TO_PLAYLIST: {
		packGuid: VariantPackGuid
		playlistGuid: string
	}
	REMOVE_SONG_FROM_PLAYLIST: {
		packGuid: VariantPackGuid
		playlistGuid: string
	}
}

export type AnalyticsEventNameType = keyof AnalyticsTrackData
export type AnalyticsTrackDataType<T extends AnalyticsEventNameType> =
	AnalyticsTrackData[T]
