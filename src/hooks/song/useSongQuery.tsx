import { SongsControllerGetByQueryKeyEnum } from "../../api/generated";
import { handleApiCall } from "../../tech/handleApiCall";
import { useApi } from "../api/useApi";
import useAuth from "../auth/useAuth";

export type SongQueryType = SongsControllerGetByQueryKeyEnum;

export default function useSongQuery(key: SongsControllerGetByQueryKeyEnum) {
    const { songsApi } = useApi();

    const getSongs = async () => {
        const result = await handleApiCall(
            songsApi.songsControllerGetByQuery(key)
        );

        return result;
    };

    return getSongs;
}
