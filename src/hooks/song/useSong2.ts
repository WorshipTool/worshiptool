import { useEffect, useState } from "react";
import {Result, isResult, result } from "../Result";
import useFetch from '../useFetch';
import { getUrl_GETSONGBYGUID } from "../../backend/urls";
import { isSuccess } from '../../backend/dtosRequestResult';
import AllSongDataDTO, { convertAllSongDataDTOToSong } from "../../backend/dtosSong";
import Song from "../../models/song/song";

/**
 * Hook provides basic information about song. 
 * Song is chosen by guid. Please set guid at beginning, or use can use setGuid function.
 * Also, some functions can be used with song guid as parameter.
 */
export default function useSong(_guid?: string) {
    const [guid, setGuid] = useState(_guid);
    const [song, setSong] = useState<Song>({} as Song);

    const {fetchData} = useFetch();

    const getTitle = async (g?: string) : Promise<  Result<"Success"> | 
                                                    Result<"Song not found"> |
                                                    Result<"Song has no title">> => {
        if(!g)g = guid;
        if(!g)return result("Song not found");

        const res = await fetchData<AllSongDataDTO>({url: getUrl_GETSONGBYGUID(g)});
        if(isSuccess(res)) return result("Success", res.data.mainTitle);

        return result("Song has no title");
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


const {getTitle} = useSong();
const a = async () => {
    isResult(await getTitle("sddf"),"Song has no title")
}
