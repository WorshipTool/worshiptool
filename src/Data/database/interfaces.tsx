import Song from "../Song/Song";

export interface IDBSong{
    guid: string,
    mainNameGUID:string;
}

export interface IDBSongVariant{
    guid: string,
    songGUID: string,
    sheet: string,
    mainNameGUID:string;
}

export interface IDBCreator{
    guid: string,
    name:string
}

export interface IDBCSVLink{
    guid: string,
    creatorGUID: string,
    songGUID: string,
    type: string
}

export interface IDBSongName{
    guid: string,
    songGUID: string,
    name: string,
}

export interface IDBAllSongData{
    song: IDBSong,
    names: IDBSongName[]
    creators: IDBCSVLink[],
    variants: IDBSongVariant[]
}

export interface IDBSongDataArray{
    songs: IDBAllSongData[]
}

