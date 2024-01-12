import { useEffect, useState } from "react";
import Song from "../../interfaces/song/song";
import useTranspose from "./hooks/useTranspose";
import useAuth from "../auth/useAuth";
import convertAllSongDataDTOToSong from "../../api/allSongDataDTOToSong";
import { VariantDTO } from "../../interfaces/variant/VariantDTO";
import { SongData, SongsApi } from "../../api/generated";
import { useApiState, useApiStateEffect } from "../../tech/ApiState";
import { handleApiCall } from '../../tech/handleApiCall';



export default function useSong(g:string|null){
    const [guid, setGUID] = useState(g);

    const {apiConfiguration} = useAuth();
    const songApi = new SongsApi(apiConfiguration);

    const [{
        data: song, 
        loading
    }, reload] = useApiStateEffect<Song | null>(async ()=>{
        if(!guid)return null;
        const data = await handleApiCall(songApi.songsControllerGetSongData(guid));
        return convertAllSongDataDTOToSong(data);
    },[guid]);

    const {user, isLoggedIn} = useAuth();

    const {transpose:trans} = useTranspose();


    const isCreatedByMe = (variant: VariantDTO) => {
        if(!isLoggedIn()||user===undefined)return false;
        return variant.createdBy==user.guid;
    }


    const getTitle = () : string=> {
        return song?.title || "undefined";
    }

    const getText = (part?: number): string => {
        if(!song) return "undefined";

        if(song.variants.length==0)return "";

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
        if(!song || song.variants.length==0) return "undefined";
        if(song.variants.length==0)return "undefined";
        return song.variants[0].sheetData;
    }

    const transpose = (semitones: number) => {
        trans(semitones);
    }


    return {
        setGUID,
        song, 
        // setSong,
        getName: getTitle,
        getText,
        getSheetData,
        loading,
        transpose,
        reload,
        isCreatedByMe
    }

}