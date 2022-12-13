import { SERVER_URL } from "./database/Constants";
import { IDBAllSongData, IDBSongDataArray } from "./database/interfaces";
import Song, { CreateSongFromIDBAll as createSongFromIDBAll } from "./Song/Song";

export const searchSongs = async (searchString: string) : Promise<Song[]> =>{
    const url = SERVER_URL+"/songs/search/"+searchString;
    const response = await fetch(url);
    const data : IDBSongDataArray = await response.json();
    if(!data.songs){
        return []
    }
    const songs = data.songs.map((song)=>createSongFromIDBAll(song))
    return songs;
}
export const loadSongByGUID = async (guid:string) : Promise<Song> => {
    const url = SERVER_URL+"/songs/"+guid;
    const response = await fetch(url);
    const data : IDBAllSongData = await response.json();
    const song = createSongFromIDBAll(data);
    return song;
}