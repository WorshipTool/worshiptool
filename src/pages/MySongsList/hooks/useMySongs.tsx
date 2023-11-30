import { Sheet } from "@pepavlin/sheet-api"
import { VariantDTO } from "../../../interfaces/variant/VariantDTO"
import useAuth from "../../../hooks/auth/useAuth"
import { useEffect, useState } from "react";
import useFetch from '../../../hooks/useFetch';
import { getUrl } from "../../../api/urls";
import { GETUSERSONGLIST_URL } from "../../../api/constants";
import { GetUserSongListResultDTO } from "../../../api/dtos/dtosSong";
import { isRequestSuccess } from "../../../api/dtos/RequestResult";
import { mapApiToVariant } from "../../../api/dtos/variant/mapApiToVariant";

interface IUseMySongs{
    variants: VariantDTO[],
    loaded: boolean,
}

export default function useMySongs() : IUseMySongs{
    const {isLoggedIn} = useAuth();
    const [variants, setVariants] = useState<VariantDTO[]>([]);

    const {fetchData} = useFetch();
    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        if(!isLoggedIn()) return;
        fetchData<GetUserSongListResultDTO>({url: getUrl(GETUSERSONGLIST_URL)})
        .then((result)=>{
            if(isRequestSuccess(result)){
                const v = (result.data.variants.map((variant)=>{
                    return mapApiToVariant(variant);
                }));
                console.log(v)
                setVariants(v);
            }

            setLoaded(true);

        })
    },[isLoggedIn])
    return {
        variants: variants,
        loaded: loaded,
    }
}