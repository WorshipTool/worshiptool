import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'

export interface Group {
	name: string
	code: string
	guid: string
	selection: PlaylistGuid
	payload: GroupPayloadType
}

export type GroupPayloadType = Partial<{
	pinnedPlaylist: PlaylistGuid | null
}>
