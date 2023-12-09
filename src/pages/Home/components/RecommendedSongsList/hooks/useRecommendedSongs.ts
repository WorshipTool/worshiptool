import { useEffect, useState } from "react";
import useSongQuery from "../../../../../hooks/song/useSongQuery";
import { isRequestSuccess } from "../../../../../api/dtos/RequestResult";
import { SearchSongDataDTO } from "../../../../../api/dtos/dtosSong";
import { VariantDTO } from "../../../../../interfaces/variant/VariantDTO";
import { mapApiToVariant } from '../../../../../api/dtos/variant/mapApiToVariant';

export default function useRecommendedSongs(){

    const [data, setData] = useState<VariantDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const getRandomSongs = useSongQuery({key:"random"});
    
    const getData = async ()=>{
        const res = await getRandomSongs({});
        if(!isRequestSuccess(res)){
            throw Error(res.message);
        }
        console.log("Recommended: ", res.data);
        const sgs : SearchSongDataDTO[] = res.data.songs.map((data)=>{
            return {
                guid: data.guid,
                variant: data.variant
            };
        })
        return sgs;
    };

    useEffect(()=>{
        getData()
        .then((result)=>{
            setData(result.map((r)=>mapApiToVariant(r.variant)));
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