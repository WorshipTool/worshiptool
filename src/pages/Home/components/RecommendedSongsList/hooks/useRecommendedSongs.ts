import { SearchSongDataDTO } from "../../../../../api/dtos/dtosSong";
import { VariantDTO } from "../../../../../interfaces/variant/VariantDTO";
import { mapApiToVariant } from '../../../../../api/dtos/variant/mapApiToVariant';
import { SongsApi, SongsControllerGetByQueryKeyEnum } from "../../../../../api/generated";
import { handleApiCall } from '../../../../../tech/handleApiCall';
import { useApiStateEffect } from "../../../../../tech/ApiState";

export default function useRecommendedSongs(){

    const songAPI = new SongsApi();

    const [state] = useApiStateEffect<VariantDTO[]>(async ()=>{
        const result = await handleApiCall(songAPI.songsControllerGetByQuery(SongsControllerGetByQueryKeyEnum.Random));
        const sgs : SearchSongDataDTO[] = result.songs.map((data)=>{
            return {
                guid: data.guid,
                variant: data.variant
            };
        })
        return sgs.map((r)=>mapApiToVariant(r.variant));
    },[]);

    

    return {
        data : state.data || [],
        isLoading: state.loading,
        isError : state.error,
        isSuccess : state.success,
    }
}