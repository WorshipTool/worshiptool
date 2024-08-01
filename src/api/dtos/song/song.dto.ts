import { SongVariantDto } from '../../../interfaces/variant/songVariant.types'
import { MediaDto } from '../media/MediaDto'

export type SongDto = {
	guid: string
	title: string
	variants: SongVariantDto[]
	media: MediaDto[]
	tags: string[]
}
