import { MediaTypes } from "../../models/song/media";
import { SongDataSource } from "./dtosNewSongData";
import { CreatorType } from "../../models/song/creator";


export interface SongDataVariantDTO{
    guid:string,
    prefferedTitle: string,
    sheetData: string,
    sheetText: string,
    verified: boolean,
    createdBy: string,
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
    alternativeTitles: string[],
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
    guids: string[]
}