import { ApiVariantDTO } from "../variant/ApiVariantDTO"
import { ApiPlaylistItemDTO } from "./ApiPlaylistItemDTO"

export interface PlaylistDataDTO{
    guid:string,
    title:string
}

export interface GetPlaylistsResultDTO{
    playlists: PlaylistDataDTO[]
}

export interface PostCreatePlaylistResultDTO{
    guid: string
}

export interface PostCreatePlaylistBodyDTO{
    title: string
}


export interface PostDeletePlaylistBodyDTO{
    guid: string
}
export type PostDeletePlaylistResultDTO = boolean;

export interface GetSongsInPlaylistParamsDTO{
    guid: string
}
export interface GetSongsInPlaylistResultDTO{
    items: ApiPlaylistItemDTO[],
    title: string
}
export interface SearchResultDTO{
    guid: string,
    variant: ApiVariantDTO
}


export interface GetSearchInPlaylistResultDTO{
    guid: string,
    items: ApiPlaylistItemDTO[]
}

export interface PostAddVariantToPlaylistBodyDTO{
    variant: string,
    playlist: string
}

export interface DeleteRemoveVariantFromPlaylistBodyDTO{
    variant: string,
    playlist: string
}

export interface ApiReorderPlaylistItemDTO{
    guid: string,
    order: number
}

export interface PostReorderPlaylistBodyDTO{
    items: ApiReorderPlaylistItemDTO[]
    guid:string
}