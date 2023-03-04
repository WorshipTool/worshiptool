import { useEffect, useState } from "react";
import {isSuccess, result } from "../Result";
import useFetch from '../useFetch';
import { getUrl_GETSONGBYGUID } from "../../backend/urls";
import AllSongDataDTO, { convertAllSongDataDTOToSong } from "../../backend/dtosSong";
import Song from "../../models/song/song";

type SongIsUndefinedResult = "Song is undefined";
type SongNotFoundResult = "Song not found";

/**
 * Hook provides basic information about song. 
 * Song is chosen by guid. Please set guid at beginning, or use can use setGuid function
 */
export default function useSong(_guid?: string) {
    const [guid, setGuid] = useState(_guid);
    const [song, setSong] = useState<Song>({} as Song);

    const {fetchData} = useFetch();
    const [data, setData] = useState<AllSongDataDTO>();

    useEffect(()=>{
        reload();
    },[guid]);

    /**
     * This function reloads song data from current guid. 
     * The result is set to data state variable.
     */
    const reload = async () : Promise<AllSongDataDTO> => {

        if(!guid) return result("Song is undefined");

        const res = await fetchData<AllSongDataDTO>({url: getUrl_GETSONGBYGUID(guid)});
        if(isSuccess(res)){

            setData(res.data);

            return result("Success", res.data);
        }

        return result("Error");
    }

    const getTitle = () : string => {     
        //guid not set  
        if(!guid) return result("Song is undefined"); 
        if(!data) return result("Song not found");

        if(data.alternativeTitles?.length<1) 
            return result("Song has no title");

        return result("Success", data.alternativeTitles[0]);
    }



    useEffect(()=>{
        if(!guid)return;
        
        fetchData<AllSongDataDTO>({url: getUrl_GETSONGBYGUID(guid)}).then(async (r)=>{
            if(isSuccess(r)){
                const d : AllSongDataDTO = r.data;
                const s = convertAllSongDataDTOToSong(d);
                setSong(s);
            }
        })
    },[guid]);


    return {
        setGuid,
        getTitle
    }

    
}

