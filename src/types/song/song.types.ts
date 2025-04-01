import { BasicVariantPack } from '@/api/dtos'
import { SongGuid as SG } from '../../interfaces/song/song'
export type SongGuid = SG

export type SongTitle = string & { readonly brand: unique symbol }

export type BasicSong = {
	guid: SongGuid
	title: SongTitle
	original?: BasicVariantPack
	packs: BasicVariantPack[]
}
