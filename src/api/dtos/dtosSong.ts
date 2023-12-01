import { MediaTypes } from "../../interfaces/song/media";
import { SongDataSource } from "./dtosNewSongData";
import { CreatorType } from "../../interfaces/song/creator";
import { ApiVariantDTO } from "./variant/ApiVariantDTO";


export interface SongDataVariantDTO{
    guid:string,
    prefferedTitle: string,
    titles: string[],
    sheetData: string,
    sheetText: string,
    verified: boolean,
    createdBy: string,
    createdByLoader: boolean,
    sources: SongDataSource[],
    creators: SongDataCreatorDTO[]
}

export interface SongDataCreatorDTO{
    name: string,
    type: CreatorType
}

export interface SongDataMediaDTO{
    type: MediaTypes,
    url: string
}

export default interface AllSongDataDTO{
    guid: string,
    mainTitle: string,
    creators: SongDataCreatorDTO[],
    variants: SongDataVariantDTO[],
    media: SongDataMediaDTO[],
    tags: string[]
}



export interface songGetQueryDTO{
    key: "all"|"search"|"random"|"unverified"|"loaderUnverified",
    searchKey?:string,
    body?: string,
    page?: number
}

export interface songGetResultDTO{
    songs: AllSongDataDTO[]
}

export interface SongSearchResultDTO{
    songs: SearchSongDataDTO[]
}

export interface SearchSongDataDTO{
    guid: string,
    variant: ApiVariantDTO
}


export interface ListSongDataDTO{
    guid: string,
    title: string
}
export interface ListResultDTO{
    songs: ListSongDataDTO[]
}



export interface songGetCountDTO{
    count: number
}

export interface SongsMergeBody{
    guid1: string,
    guid2: string
}
export interface SongsMergeResult{
    guid: string
}

export interface PostParseImageBody{
    file: string
}

export interface PostParseImageResultDTO{
    sheets: {
        title:string,
        data:string
    }[]
}

export interface GetUserSongListResultDTO{
    variants: ApiVariantDTO[]
}

export interface PostEditVariantBody{
    guid: string,
    sheetData: string,
    title: string
}