import { useEffect, useState } from "react";
import useSongQuery from "../../../../../hooks/song/useSongQuery";
import { isRequestSuccess } from "../../../../../backend/dtos/RequestResult";
import { SearchSongDataDTO } from "../../../../../backend/dtos/dtosSong";

export default function useRecommendedSongs(){

    const [data, setData] = useState<SearchSongDataDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const getRandomSongs = useSongQuery({key:"random"});
    
    const getData = async ()=>{
        const res = await getRandomSongs({});
        if(!isRequestSuccess(res)){
            throw Error(res.message);
        }
        const sgs : SearchSongDataDTO[] = res.data.songs.map((data)=>{
            return {
                guid: data.guid,
                title: data.mainTitle,
                sheetData: data.variants[0]?.sheetData,
                createdBy: "",
                createdByLoader: false,
                verified:true
            };
        })
        return sgs;
    };

    useEffect(()=>{
        getData()
        .then((result)=>{
            setData(result);
            setLoading(false);
            setIsSuccess(true);
        })
        .catch((e)=>{
            setLoading(false);
            setIsError(true);
        })
    },[]);

    return {
        data,
        isLoading: loading,
        isError,
        isSuccess
    }
}