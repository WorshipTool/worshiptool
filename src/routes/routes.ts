import { RoutesPaths } from "./routes.types";

const getReplacedUrl = (url: string, params: { [key: string]: string }) => {
    let result = url;
    for (const key in params) {
        result = result.replace(`:${key}`, params[key]);
    }
    return result;
};

export const getVariantUrl = (variantAlias: string) => {
    const alias = variantAlias;

    // Part before first -
    const hex = alias.split("-")[0];
    // Part after first - to the end
    const code = alias.split("-").slice(1).join("-");

    return getReplacedUrl(VARIANT_URL, { hex, alias: code });
};

export const getPlaylistUrl = (playlistGuid: string) => {
    return getReplacedUrl(PLAYLIST_URL, { guid: playlistGuid });
};

export const getGroupUrl = (name: string) => {
    return getReplacedUrl(GROUP_URL, { groupName: name });
};

export const getPlaylistCardsUrl = (playlistGuid: string) => {
    return getReplacedUrl(PLAYLIST_CARDS_URL, { guid: playlistGuid });
};

export const VARIANT_URL = "/p/:hex/:alias";
export const PLAYLIST_URL = "/playlist/:guid";
export const PLAYLIST_CARDS_URL = "/playlist/:guid/karty";
export const GROUP_URL = "/skupina/:groupName";
export const DOCUMENTATION_URL = "/dokumentace";
export const ADD_MENU_URL = "/vytvorit";
export const UPLOAD_URL = "/nahrat";
export const UPLOAD_PARSE_URL = "/nahrat/hledani";
export const WRITE_SONG_URL = "/vytvorit/napsat";
export const LOGIN_URL = "/prihlaseni";
export const SIGNUP_URL = "/registrace";
export const ACCOUNT_URL = "/ucet";
export const USERS_PLAYLISTS_URL = "/ucet/playlisty";
export const USERS_SONGS_URL = "/ucet/pisne";
export const SONGS_LIST_URL = "/seznam";
export const TEST_URL = "/test";

export type CustomRouterProps = {
    variant: undefined;
    playlist: undefined;
    group: undefined;
    documentation: undefined;
    addMenu: undefined;
    upload: undefined;
    uploadParse: undefined;
    writeSong: undefined;
    login: {
        previousPage: string;
    };
    signup: undefined;
    account: undefined;
    usersPlaylists: undefined;
    usersSongs: undefined;
    songsList: undefined;
    test: undefined;
};

export const routesPaths: RoutesPaths<CustomRouterProps> = {
    variant: VARIANT_URL,
    playlist: PLAYLIST_URL,
    group: GROUP_URL,
    documentation: DOCUMENTATION_URL,
    addMenu: ADD_MENU_URL,
    upload: UPLOAD_URL,
    uploadParse: UPLOAD_PARSE_URL,
    writeSong: WRITE_SONG_URL,
    login: LOGIN_URL,
    signup: SIGNUP_URL,
    account: ACCOUNT_URL,
    usersPlaylists: USERS_PLAYLISTS_URL,
    usersSongs: USERS_SONGS_URL,
    songsList: SONGS_LIST_URL,
    test: TEST_URL
};
