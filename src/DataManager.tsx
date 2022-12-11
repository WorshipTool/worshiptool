import { SERVER_URL } from "./database/Constants";
import { IDBAllSongData, IDBSongArray } from "./database/interfaces";
import Song, { CreateSongFromIDBAll } from "./database/Song";

export const SearchSongs = async () : Promise<Song[]> =>{
    const url = SERVER_URL+"/songs/search";
        const response = await fetch(url);
        const data : IDBSongArray = await response.json();
        if(!data.songs){
            return []
        }
        const songs = data.songs.map((song)=>{
            const s = new Song();
            s.name = song.name;
            return s;
        })
    return songs;
}