import { SearchSongDataDTO } from "../../../../../api/dtos/dtosSong";
import { VariantDTO } from "../../../../../interfaces/variant/VariantDTO";
import { mapApiToVariant } from "../../../../../api/dtos/variant/mapApiToVariant";
import {
    SongsApi,
    SongsControllerGetByQueryKeyEnum
} from "../../../../../api/generated";
import { handleApiCall } from "../../../../../tech/handleApiCall";
import { useApiStateEffect } from "../../../../../tech/ApiState";
import {
    mapSearchResultApiToSongVariantDtoArr,
    SongVariantDto
} from "../../../../../api/dtos";

export default function useRecommendedSongs() {
    const songAPI = new SongsApi();

    const [state] = useApiStateEffect<SongVariantDto[]>(async () => {
        const result = await handleApiCall(
            songAPI.songsControllerGetByQuery(
                SongsControllerGetByQueryKeyEnum.Random
            )
        );
        return mapSearchResultApiToSongVariantDtoArr(result);
    }, []);

    return {
        data: state.data || [],
        isLoading: state.loading,
        isError: state.error,
        isSuccess: state.success
    };
}
