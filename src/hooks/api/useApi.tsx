import { useMemo } from "react";
import useAuth from "../auth/useAuth";
import {
    SongsApi,
    PlaylistGettingApi,
    PlaylistEditingApi,
    SongGettingApi,
    SongAddingApi,
    UrlAliasApi,
    GetterApi,
    AuthApi,
    GroupApi
} from "../../api/generated";

export const useApi = () => {
    const { apiConfiguration, user } = useAuth();

    const apis = {
        songsApi: new SongsApi(apiConfiguration),
        playlistGettingApi: new PlaylistGettingApi(apiConfiguration),
        playlistEditingApi: new PlaylistEditingApi(apiConfiguration),
        songGettingApi: new SongGettingApi(apiConfiguration),
        songAddingApi: new SongAddingApi(apiConfiguration),
        urlAliasApi: new UrlAliasApi(apiConfiguration),
        getterApi: new GetterApi(apiConfiguration),
        groupApi: new GroupApi(apiConfiguration),
        authApi: new AuthApi(apiConfiguration)
    };

    return apis;
};
