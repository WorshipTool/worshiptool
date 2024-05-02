import { RoutesPathsType } from "./routes.types";

export const getReplacedUrlWithParams = (
    url: string,
    params: { [key: string]: string }
) => {
    let result = url;
    for (const key in params) {
        result = result.replace(`:${key}`, params[key]);
    }
    return result;
};

export const parseVariantAlias = (variantAlias: string) => {
    const alias = variantAlias;

    // Part before first -
    const hex = alias.split("-")[0];
    // Part after first - to the end
    const code = alias.split("-").slice(1).join("-");

    return { hex, alias: code };
};

export const COMMON_SETTINGS_URL = "/nastaveni";

export type RouterProps = {
    home: undefined;
    variant: {
        title: string;
    };
    playlist: undefined;
    playlistCards: undefined;
    group: undefined;
    groupSettings: undefined;
    documentation: undefined;
    addMenu: undefined;
    upload: undefined;
    uploadParse: {
        files: File[];
    };
    writeSong: undefined;
    login: {
        previousPage: string;
        message?: string;
    };
    signup: undefined;
    account: undefined;
    usersPlaylists: undefined;
    usersSongs: undefined;
    songsList: undefined;
    test: undefined;
};

export const routesParams = {
    variant: ["hex", "alias"],
    playlist: ["guid"],
    playlistCards: ["guid"],
    group: ["groupCode"],
    groupSettings: ["groupCode"]
} as const;

export const routesPaths: RoutesPathsType<RouterProps> = {
    home: "/",
    variant: "/p/:hex/:alias",
    playlist: "/playlist/:guid",
    playlistCards: "/playlist/:guid/prezentace",
    group: "/skupina/:groupName",
    groupSettings: "/skupina/:groupName" + COMMON_SETTINGS_URL,
    documentation: "/dokumentace",
    addMenu: "/vytvorit",
    upload: "/nahrat",
    uploadParse: "/nahrat/hledani",
    writeSong: "/vytvorit/napsat",
    login: "/prihlaseni",
    signup: "/registrace",
    account: "/ucet",
    usersPlaylists: "/ucet/playlisty",
    usersSongs: "/ucet/pisne",
    songsList: "/seznam",
    test: "/test"
};
