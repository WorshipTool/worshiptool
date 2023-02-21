import { isVariableDeclarationList } from "typescript";
import SongObject, { Section } from "../models/song/song";
import convertSheetToSections from "../api/conversition/convertSheetToSections";
import { MediaTypes } from "../models/song/media";
import { SongDataSource } from "./dtosNewSongData";
import { CreatorType } from "../models/song/creator";


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


export function convertAllSongDataDTOToSong(d: AllSongDataDTO) : SongObject{
    const data = d;

    if(data===undefined){
        return {} as SongObject
    }



    return {
        guid: data.guid,
        title: data.mainTitle,
        alternativeTitles: data.alternativeTitles,
        creators: data.creators,
        variants: data.variants.filter((v)=>v).map((variant)=>{


            let sections : Section[] = [];
            if(variant.sheetData)
                sections = convertSheetToSections(variant.sheetData)

            return {
                guid: variant.guid,
                preferredTitle: variant.prefferedTitle,
                sheetData: variant.sheetData,
                sheetText: variant.sheetText,
                sections,
                verified: variant.verified,
                createdBy: variant.createdBy,
                sources: variant.sources,
                creators: variant.creators
            }
        }),
        media: d.media,
        tags: d.tags
    }
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