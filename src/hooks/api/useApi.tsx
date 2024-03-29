import { useMemo } from "react";
import useAuth from "../auth/useAuth";
import {
    PlaylistGettingApi,
    PlaylistEditingApi,
    SongGettingApi,
    SongAddingApi,
    UrlAliasApi,
    GetterApi,
    AuthApi,
    GroupApi,
    SongEditingApi,
    SongDeletingApi
} from "../../api/generated";

export const useApi = () => {
    const { apiConfiguration, user } = useAuth();

    const apis = {
        playlistGettingApi: new PlaylistGettingApi(apiConfiguration),
        playlistEditingApi: new PlaylistEditingApi(apiConfiguration),
        songGettingApi: new SongGettingApi(apiConfiguration),
        songAddingApi: new SongAddingApi(apiConfiguration),
        songEditingApi: new SongEditingApi(apiConfiguration),
        songDeletingApi: new SongDeletingApi(apiConfiguration),
        urlAliasApi: new UrlAliasApi(apiConfiguration),
        getterApi: new GetterApi(apiConfiguration),
        groupApi: new GroupApi(apiConfiguration),
        authApi: new AuthApi(apiConfiguration)
    };

    return apis;
};
