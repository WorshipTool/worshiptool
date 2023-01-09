import { isVariableDeclarationList } from "typescript";
import songObject from "../models/song";
import convertSheetToSections from "../api/conversition/convertSheetToSections";

export interface songDTO{
    guid: string,
    mainNameGUID:string;
}

export interface songVariantDTO{
    guid: string,
    songGUID: string,
    sheet: string,
    mainNameGUID:string;
}

export interface creatorDTO{
    guid: string,
    name:string
}

export interface CSVLinkDTO{
    guid: string,
    creatorGUID: string,
    songGUID: string,
    type: string
}

export interface songNameDTO{
    guid: string,
    songGUID: string,
    name: string,
}

export default interface allSongDataDTO{
    song: songDTO,
    names: songNameDTO[]
    creators: CSVLinkDTO[],
    variants: songVariantDTO[]
}


export function convertAllSongDataDTOToSong(d: allSongDataDTO) : songObject{
    const data = d;

    if(data.song===undefined){
        return {
            title: "",
            alternativeTitles: [],
            creators: [],
            variants: []
        }
    }



    return {
        title: data.names.filter( (name)=>{return name.guid==data.song.mainNameGUID})[0].name,
        alternativeTitles: data.names.filter((value)=>{value.guid!=data.song.mainNameGUID})
                                .map((name)=>{return name.name}),
        creators: [],
        variants: data.variants.map((variant)=>{

            const sections = convertSheetToSections(variant.sheet)

            return {
                preferredTitle: data.names.filter((value)=>{return value.guid==variant.mainNameGUID})[0].name,
                sheet: variant.sheet,
                sheetText: sections.map((s)=>s.text).join("\n"),
                sections
            }
        })
    }
}

export interface newSongDataDTO{
    title: string,
    sheetData: string,
    sheetText: string
}

export function convertSongToNewSongDTO(song: songObject):newSongDataDTO{
    return {
        title: song.title,
        sheetData: song.variants[0].sheet,
        sheetText: song.variants[0].sheetText
    }
}

export interface songGetQueryDTO{
    key: "all"|"search"|"random",
    body?: string,
    count?: number
}

export interface songGetResultDTO{
    guids: string[]
}
