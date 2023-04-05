import { useEffect, useState } from "react";
import Song, { Variant } from "../../models/song/song";
import useFetch from "../useFetch";
import { getUrl_GETSONGBYGUID } from "../../backend/urls";
import AllSongDataDTO from "../../backend/dtos/dtosSong";
import useTranspose from "../../sheetApi/hooks/useTranspose";
import useAuth from "../auth/useAuth";
import convertAllSongDataDTOToSong from "../../backend/api/allSongDataDTOToSong";



export default function useSong(g:string|null){
    const [guid, setGUID] = useState(g);
    const {fetchData, data, loading:fetchLoading} = useFetch();
    const [song, setSong] = useState<Song>();
    const [loading, setLoading] = useState(true);


    const {user, isLoggedIn} = useAuth();

    const {getChord, transpose:trans, getTransposeOffset, setTransposeOffset} = useTranspose();

    useEffect(()=>{
        if(song){
            setGUID(song.guid);
        }
    },[song]);

    useEffect(()=>{
        setLoading(fetchLoading);
    },[fetchLoading])

    useEffect(()=>{
        reload();
    },[guid])

    useEffect(()=>{
        const d : AllSongDataDTO = data;
        if(d===undefined){
            setSong(undefined);
            return;
        }
        const s = convertAllSongDataDTOToSong(d);
        setSong(s);

    },[data]);

    const reload = () => {
        if(guid) fetchData({url:getUrl_GETSONGBYGUID(guid)},(r)=>{
            //console.log(r);
        });
    }

    const isCreatedByMe = (variant: Variant) => {
        if(!isLoggedIn()||user===undefined)return false;
        return variant.createdBy==user.guid;
    }


    const getTitle = () : string=> {
        if(song===undefined) return "undefined";
        return song.title;
    }

    const getText = (part?: number): string => {
        if(song===undefined) return "undefined";

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
        if(song===undefined) return "undefined";
        if(song.variants.length==0)return "undefined";
        return song.variants[0].sheetData;
    }

    const transpose = (semitones: number) => {
        trans(semitones);
    }

    const getTransposedVariant = (index: number) : Variant => {

        if(song===undefined||song.variants.length<=index)return {} as Variant

        let transSection = song.variants[index].sections.map((section)=>{
            if(section.lines===undefined) return {...section};

            return {...section, lines: section.lines.map((line)=>{
                return {...line, segments: line.segments.map((segment)=>{
                    if(segment.chord===undefined) return segment;
                    return { ...segment,
                        chord: getChord(segment.chord)
                    };
                })}
            })};

        });

        const transVariant = {...song.variants[index], sections: transSection};

        return transVariant;
    }

    return {
        setGUID,
        song, setSong,
        getName: getTitle,
        getText,
        getSheetData,
        loading,
        transpose,
        getTransposedVariant,
        reload,
        isCreatedByMe
    }

}