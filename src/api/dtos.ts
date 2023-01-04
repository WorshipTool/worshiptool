import { isVariableDeclarationList } from "typescript";
import song from "../models/song";

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


export function convertAllSongDataDTOToSong(d: allSongDataDTO) : song{
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
            return {
                preferredTitle: data.names.filter((value)=>{return value.guid==variant.mainNameGUID})[0].name,
                sheet: variant.sheet
            }
        })
    }
}