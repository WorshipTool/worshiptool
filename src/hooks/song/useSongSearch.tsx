import { SongsApi } from "../../api/generated";
import { handleApiCall } from "../../tech/handleApiCall";
import { useApi } from "../api/useApi";
import useAuth from "../auth/useAuth";

type useSongSearchProps = {
    searchKey: string;
    page?: number;
    signal?: AbortSignal;
};

export default function useSongSearch() {
    const { songsApi } = useApi();
    const { user } = useAuth();

    const getSongs = async (additionalParams: useSongSearchProps) => {
        try {
            const result = await handleApiCall(
                songsApi.songsControllerGetBySearch(
                    additionalParams.searchKey,
                    additionalParams.page || 0,
                    {
                        signal: additionalParams.signal
                    }
                )
            );
            // Createdy by user first
            const ordered = result.songs.sort((a, b) => {
                if (a.variant.createdByGuid === user?.guid) return -1;
                if (b.variant.createdByGuid === user?.guid) return 1;
                return 0;
            });

            result.songs = ordered;
            return result;
        } catch (e) {
            console.log(e);
        }

        return { songs: [] };
    };

    return getSongs;
}
