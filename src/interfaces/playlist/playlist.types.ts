import { TeamGuid } from '@/app/(submodules)/(teams)/sub/tymy/tech'
import { note } from '@pepavlin/sheet-api'
import { SongVariantDto } from '../../api/dtos'

export type PlaylistGuid = string & { readonly brand: unique symbol }
export type PlaylistItemGuid = string & { readonly brand: unique symbol }

export default interface PlaylistDto {
	guid: PlaylistGuid
	title: string
	items: PlaylistItemDto[]
	ownerGuid: string

	teamAlias?: string
	teamGuid?: TeamGuid
}

export interface PlaylistItemDto {
	guid: PlaylistItemGuid
	toneKey: note
	order: number
	variant: SongVariantDto
}
