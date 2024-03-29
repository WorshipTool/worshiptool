import { BACKEND_URL } from "./constants";
import { GetSongsInPlaylistParamsDTO } from "./dtos/playlist/dtosPlaylist";

export function getUrl(relativeUrl: string) {
    const generatedURL = BACKEND_URL + relativeUrl;
    return generatedURL;
}
