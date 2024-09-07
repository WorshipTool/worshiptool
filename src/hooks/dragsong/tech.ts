import { SongVariantDto, VariantPackAlias, VariantPackGuid } from '@/api/dtos'

export type DragSongDto = {
	packGuid: VariantPackGuid
	alias: VariantPackAlias
	title: string
}

export const SONG_DRAG_DATA_TYPE = 'text/song-pack'

export const mapVariantToDragDto = (variant: SongVariantDto): DragSongDto => {
	return {
		packGuid: variant.packGuid,
		alias: variant.packAlias,
		title: variant.preferredTitle,
	}
}

export const getSongDataFromDragEvent = (
	event: React.DragEvent<HTMLDivElement>
): DragSongDto | null => {
	const data = event.dataTransfer.getData(SONG_DRAG_DATA_TYPE)
	if (!data) return null
	return JSON.parse(data)
}

export const isDragObjectSong = (
	event: React.DragEvent<HTMLDivElement>
): boolean => {
	return event.dataTransfer.types.includes(SONG_DRAG_DATA_TYPE)
}
