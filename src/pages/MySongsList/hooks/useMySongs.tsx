import { Sheet } from "@pepavlin/sheet-api";
import { VariantDTO } from "../../../interfaces/variant/VariantDTO";
import useAuth from "../../../hooks/auth/useAuth";
import { useEffect, useState } from "react";
import { mapApiToVariant } from "../../../api/dtos/variant/mapApiToVariant";
import { useApiState, useApiStateEffect } from "../../../tech/ApiState";
import { handleApiCall } from "../../../tech/handleApiCall";
import {
    mapSongDataVariantApiToSongVariantDto,
    mapSongVariantDataOutDtoToSongVariantDto,
    SongVariantDto
} from "../../../api/dtos";
import { useApi } from "../../../hooks/api/useApi";

interface IUseMySongs {
    variants: SongVariantDto[];
    loaded: boolean;
}

export default function useMySongs(): IUseMySongs {
    const { isLoggedIn } = useAuth();
    const { songGettingApi } = useApi();

    const [loaded, setLoaded] = useState(false);
    const [apiState] = useApiStateEffect(async () => {
        if (!isLoggedIn) return;
        const result = await handleApiCall(
            songGettingApi.songGettingControllerGetSongListOfUser()
        );
        return result.variants.map((variant) => {
            return mapSongVariantDataOutDtoToSongVariantDto(variant);
        });
    }, [isLoggedIn]);

    return {
        variants: apiState.data || [],
        loaded: !apiState.loading
    };
}
