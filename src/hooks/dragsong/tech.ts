import { SongVariantDto, VariantPackAlias, VariantPackGuid } from '@/api/dtos'
import { SongGettingApi } from '@/api/generated'
import { ApiWrappedWithMapping } from '@/api/tech-and-hooks/api-wrapper'

export type DragSongDto = {
	packGuid: VariantPackGuid
	alias: VariantPackAlias
	title: string
	draggedFromExternalSource?: boolean
}

export const SONG_DRAG_DATA_TYPE = 'text/song-pack'

export const mapVariantToDragDto = (variant: SongVariantDto): DragSongDto => {
	return {
		packGuid: variant.packGuid,
		alias: variant.packAlias,
		title: variant.preferredTitle,
	}
}

export const getSongDataFromDragEvent = async (
	event: React.DragEvent<HTMLDivElement>,
	songGettingApi: ApiWrappedWithMapping<SongGettingApi, any>
): Promise<DragSongDto | null> => {
	const data = event.dataTransfer.getData(SONG_DRAG_DATA_TYPE)
	if (!data) {
		const url = event.dataTransfer.getData('text/uri-list')
		if (url) {
			return await getSongDataFromExternalUrl(url, songGettingApi)
		}
	}
	return JSON.parse(data)
}

const getSongDataFromExternalUrl = async (
	url: string,
	songGettingApi: ApiWrappedWithMapping<SongGettingApi, any>
): Promise<DragSongDto | null> => {
	console.log(url)

	try {
		const data = await songGettingApi.getPublicSongBySource(url)
		return {
			packGuid: data.packGuid as VariantPackGuid,
			alias: data.alias as VariantPackAlias,
			title: data.title,
			draggedFromExternalSource: true,
		}
	} catch (e) {}
	return null
}

export const isDragObjectSong = (
	event: React.DragEvent<HTMLDivElement>
): boolean => {
	const isOurSong = event.dataTransfer.types.includes(SONG_DRAG_DATA_TYPE)

	return isOurSong
}
