import { CreatorType } from "../../interfaces/song/creator"
import { MediaTypes } from "../../interfaces/song/media"
import Song from "../../interfaces/song/song"
import { SourceTypes } from "../../interfaces/song/source"

export interface SongDataMedia{
    type: MediaTypes,
    url: string
}

export interface SongDataSource{
    type: SourceTypes,
    value: string
}

export interface SongDataCreator{     
    type: CreatorType,
    name: string
}

export interface NewSongDataDTO{
    title: string,
    sheetData: string,
    media: SongDataMedia[],
    songGuid: string,
    source: SongDataSource|SongDataSource[],
    tags: string[],
    creators: SongDataCreator[]
}

export interface NewSongDataResult{
    songGuid:string,
    message: string
}

export function convertSongToNewSongDTO(song: Song):Partial<NewSongDataDTO>{
    return {
        title: song.title,
        sheetData: song.variants[0].sheetData
    }
}