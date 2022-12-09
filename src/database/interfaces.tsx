export interface IDBSong{
    guid: string,
    name: string
}

export interface IDBSongVariant{
    guid: string,
    songGUID: string,
    sheet: string
}

export interface IDBCreator{
    guid: string,
    name:string
}

export interface IDBCSLink{
    guid: string,
    creatorGUID: string,
    songGUID: string,
    type: string
}

export interface IDBAllSongData{
    song: IDBSong,
    creators: {creator: IDBCreator, link: IDBCSLink}[],
    variants: IDBSongVariant[]
}

export interface IDBSongArray{
    songs: IDBSong[]
}

