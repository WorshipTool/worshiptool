import { useEffect, useState } from "react";
import song from "../models/song";
import useFetch from "./useFetch";
import { getUrl_GETSONGBYGUID } from "../api/urls";
import allSongDataDTO, { convertAllSongDataDTOToSong } from "../api/dtos";
import convertSheetToSections from "../songAPI/convertSheetToSections";



export default function useSong(g:string|null){
    const [guid, setGUID] = useState(g);
    const {fetchData, data, loading:fetchLoading} = useFetch();
    const [song, setSong] = useState<song>();
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        setLoading(fetchLoading);
    },[fetchLoading])

    useEffect(()=>{
        if(guid) fetchData({url:getUrl_GETSONGBYGUID(guid)});
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

        if(part===undefined){
            return song.variants[0].sections
                    .map((section)=>{return section.text}).join("\n");
        };
        if(song.variants[0].sections.length<=part)return "";
        const t = song.variants[0].sections[part].text;
        if(t) return t;
        return "";
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