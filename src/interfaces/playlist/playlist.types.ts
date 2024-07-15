import { note } from '@pepavlin/sheet-api'
import { SongVariantDto } from '../../api/dtos'

export type PlaylistGuid = string & { readonly brand: unique symbol }
export type PlaylistItemGuid = string & { readonly brand: unique symbol }

export default interface PlaylistDto {
	guid: PlaylistGuid
	title: string
	items: PlaylistItemDto[]
	ownerGuid: string
}

export interface PlaylistItemDto {
	guid: PlaylistItemGuid
	toneKey: note
	order: number
	variant: SongVariantDto
}
