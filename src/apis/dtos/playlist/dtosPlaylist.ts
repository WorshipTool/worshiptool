import { ApiVariantDTO } from "../variant/ApiVariantDTO"

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
    variants: ApiVariantDTO[],
    title: string
}

export interface PostAddVariantToPlaylistBodyDTO{
    variant: string,
    playlist: string
}

export interface DeleteRemoveVariantFromPlaylistBodyDTO{
    variant: string,
    playlist: string
}