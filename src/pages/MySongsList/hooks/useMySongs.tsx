import { Sheet } from "@pepavlin/sheet-api"
import { VariantDTO } from "../../../interfaces/variant/VariantDTO"
import useAuth from "../../../hooks/auth/useAuth"
import { useEffect, useState } from "react";
import { mapApiToVariant } from "../../../api/dtos/variant/mapApiToVariant";
import { SongsApi } from "../../../api/generated";
import { useApiState, useApiStateEffect } from "../../../tech/ApiState";
import { handleApiCall } from "../../../tech/handleApiCall";

interface IUseMySongs{
    variants: VariantDTO[],
    loaded: boolean,
}

export default function useMySongs() : IUseMySongs{
    const {isLoggedIn, apiConfiguration} = useAuth();

    const [loaded, setLoaded] = useState(false);
    const songsApi = new SongsApi(apiConfiguration);
    const [apiState] = useApiStateEffect(async ()=>{
        if(!isLoggedIn) return;
        const result = await handleApiCall(songsApi.songsControllerGetSongListOfUser());
        return result.variants.map((variant)=>{
            return mapApiToVariant(variant);
        })
    },[isLoggedIn]);


    return {
        variants: apiState.data || [],
        loaded: !apiState.loading,
    }
}