import { handleApiCall } from "../../../../../tech/handleApiCall";
import { useApiStateEffect } from "../../../../../tech/ApiState";
import {
    mapSongVariantDataOutDtoToSongVariantDto,
    SongVariantDto
} from "../../../../../api/dtos";
import { useApi } from "../../../../../hooks/api/useApi";

export default function useRecommendedSongs() {
    const { songGettingApi } = useApi();

    const [state] = useApiStateEffect<SongVariantDto[]>(async () => {
        const result = await handleApiCall(
            songGettingApi.songGettingControllerGetRecommendedSongs()
        );
        return result.variants.map((v) =>
            mapSongVariantDataOutDtoToSongVariantDto(v)
        );
    }, []);

    return {
        data: state.data || [],
        isLoading: state.loading,
        isError: state.error,
        isSuccess: state.success
    };
}
