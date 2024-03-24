import { useMemo } from "react";
import * as api from "../../api/generated";
import useAuth from "../auth/useAuth";

export const useApi = () => {
    const { apiConfiguration, user } = useAuth();
    const apis = useMemo(() => {
        return {
            songsApi: new api.SongsApi(apiConfiguration),
            songGettingApi: new api.SongGettingApi(apiConfiguration),
            songAddingApi: new api.SongAddingApi(apiConfiguration),
            urlAliasApi: new api.UrlAliasApi(apiConfiguration),
            getterApi: new api.GetterApi(apiConfiguration),
            groupApi: new api.GroupApi(apiConfiguration),
            authApi: new api.AuthApi(apiConfiguration)
        };
    }, [user]);

    return apis;
};
