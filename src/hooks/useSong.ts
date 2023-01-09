import { useEffect, useState } from "react";
import Song, { Variant } from "../models/song";
import useFetch from "./useFetch";
import { getUrl_GETSONGBYGUID } from "../backend/urls";
import allSongDataDTO, { convertAllSongDataDTOToSong } from "../backend/dtosSong";
import convertSheetToSections from "../api/conversition/convertSheetToSections";
import useTranspose from "../api/hooks/useTranspose";
import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";



export default function useSong(g:string|null){
    const [guid, setGUID] = useState(g);
    const {fetchData, data, loading:fetchLoading} = useFetch();
    const [song, setSong] = useState<Song>();
    const [loading, setLoading] = useState(true);

    const {getChord, transpose:trans, getTransposeOffset, setTransposeOffset} = useTranspose();

    useEffect(()=>{
        console.log(getChord({rootNote: 'C', quality: 'maj'}))
    },[])


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

    const transpose = (semitones: number) => {
        trans(semitones);
    }

    const getTransposedVariant = (index: number) : Variant => {

        if(song===undefined)return{
            sheet: "",
            sheetText: "",
            sections: [],
            preferredTitle: ""
    }

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
        interface: song,
        getName: getTitle,
        getText,
        getSheetData,
        loading,
        transpose,
        getTransposedVariant
    }

}