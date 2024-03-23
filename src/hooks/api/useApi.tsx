import { useMemo } from "react";
import * as api from "../../api/generated";
import useAuth from "../auth/useAuth";

export const useApi = () => {
    const { apiConfiguration } = useAuth();
    const apis = useMemo(
        () => ({
            songsApi: new api.SongsApi(apiConfiguration),
            songGettingApi: new api.SongGettingApi(apiConfiguration),
            songAddingApi: new api.SongAddingApi(apiConfiguration),
            urlAliasApi: new api.UrlAliasApi(apiConfiguration)
        }),
        []
    );

    return apis;
};
