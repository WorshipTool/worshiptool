import { useEffect, useState } from "react";
import song from "../models/song";
import useFetch from "./useFetch";
import { getUrl_GETSONGBYGUD } from "../api/urls";
import allSongDataDTO, { convertAllSongDataDTOToSong } from "../api/dtos";

export default function useSong(g:string|null){
    const [guid, setGUID] = useState(g);
    const {fetchData, data, loading:fetchLoading} = useFetch();
    const [song, setSong] = useState<song>();
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        setLoading(fetchLoading);
    },[fetchLoading])

    useEffect(()=>{
        if(guid) fetchData(getUrl_GETSONGBYGUD(guid));
    },[guid])

    useEffect(()=>{
        const d : allSongDataDTO = data;
        if(d===undefined||d.song===undefined)return;
        const s = convertAllSongDataDTOToSong(d);
        setSong(s);
    },[data]);



    const getTitle = () : string=> {
        if(song===undefined) return "undefined";
        return song.title;
    }

    const getText = (part?: number): string => {
        if(song===undefined) return "undefined";

        if(part===undefined) return song.variants[0].sheet;

        return song.variants[0].sheet.substring(0, song.variants[0].sheet.length/5);
    }

    const getSheetData = () : string => {
        if(song===undefined) return "undefined";
        return song.variants[0].sheet;
    }

    return {
        setGUID,
        interface: song,
        getName: getTitle,
        getText,
        getSheetData,
        loading
    }

}