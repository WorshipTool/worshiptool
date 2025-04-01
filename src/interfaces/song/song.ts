import { MediaData } from '@/types/song/media.types'
import { SongVariantDto } from '../variant/songVariant.types'
import { Creator } from './creator'

export type SongGuid = string & { readonly brand: unique symbol }

export default interface Song {
	guid: SongGuid
	title: string
	creators: Creator[]
	variants: SongVariantDto[]
	media: MediaData[]
	tags: string[]
}
