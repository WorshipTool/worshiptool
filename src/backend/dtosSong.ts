import { isVariableDeclarationList } from "typescript";
import SongObject from "../models/song";
import convertSheetToSections from "../api/conversition/convertSheetToSections";


export interface SongDataVariantDTO{
    guid:string,
    prefferedTitle: string,
    sheetData: string,
    sheetText: string,
    verified: boolean,
    createdBy: string
}

export interface SongDataCreatorDTO{
    name: string,
    type: string
}

export default interface AllSongDataDTO{
    guid: string,
    mainTitle: string,
    alternativeTitles: string[],
    creators: SongDataCreatorDTO[],
    variants: SongDataVariantDTO[]
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
        variants: data.variants.map((variant)=>{

            const sections = convertSheetToSections(variant.sheetData)

            return {
                guid: variant.guid,
                preferredTitle: variant.prefferedTitle,
                sheetData: variant.sheetData,
                sheetText: variant.sheetText,
                sections,
                verified: variant.verified,
                createdBy: variant.createdBy
            }
        })
    }
}

export interface newSongDataDTO{
    title: string,
    sheetData: string,
    sheetText: string
}

export function convertSongToNewSongDTO(song: SongObject):newSongDataDTO{
    return {
        title: song.title,
        sheetData: song.variants[0].sheetData,
        sheetText: song.variants[0].sheetText
    }
}

export interface songGetQueryDTO{
    key: "all"|"search"|"random"|"unverified",
    searchKey?:string,
    body?: string,
    page?: number,
    conditions: any
}

export interface songGetResultDTO{
    guids: string[]
}