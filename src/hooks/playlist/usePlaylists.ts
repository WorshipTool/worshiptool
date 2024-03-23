import { ApiReorderPlaylistItemDTO } from "../../api/dtos/playlist/dtosPlaylist";
import useAuth from "../auth/useAuth";
import Playlist from "../../interfaces/playlist/PlaylistDTO";
import { Chord } from "@pepavlin/sheet-api";
import { GetSearchInPlaylistResult, SongsApi } from "../../api/generated";
import { handleApiCall } from "../../tech/handleApiCall";
import { mapPlaylistItemDtoApiToPlaylistItemDto } from "../../api/dtos/playlist/playlist.map";

export default function usePlaylists() {
    // const {fetchData, post, loading} = useFetch();

    const { apiConfiguration } = useAuth();
    const songsApi = new SongsApi(apiConfiguration);

    const addVariantToPlaylist = async (variant: string, playlist: string) => {
        return await handleApiCall(
            songsApi.songsControllerAddVariantToPlaylist({ playlist, variant })
        );
    };

    const removeVariantFromPlaylist = async (
        variant: string,
        playlist: string
    ) => {
        return await handleApiCall(
            songsApi.songsControllerRemoveVariantFromPlaylistDelete(
                variant,
                playlist
            )
        );
    };

    const isVariantInPlaylist = async (
        variant: string,
        playlist: string
    ): Promise<boolean> => {
        const result = await handleApiCall(
            songsApi.songsControllerIsVariantInPlaylist(variant, playlist)
        );
        return result;
    };

    const getPlaylistsOfUser = async () => {
        return await handleApiCall(
            songsApi.songsControllerGetPlaylistsOfUser()
        );
    };

    const createPlaylist = async (title?: string) => {
        if (!title) title = "Nový playlist";
        return await handleApiCall(
            songsApi.songsControllerCreatePlaylist({ title })
        );
    };

    const deletePlaylist = async (guid: string) => {
        return await handleApiCall(
            songsApi.songsControllerDeletePlaylistByGuid(guid)
        );
    };

    const getSongsInPlaylist = async (guid: string) => {
        return await handleApiCall(
            songsApi.songsControllerGetSongsInPlaylistByGuid(guid)
        );
    };

    const getPlaylistByGuid = async (guid: string): Promise<Playlist> => {
        const result = await handleApiCall(
            songsApi.songsControllerGetSongsInPlaylistByGuid(guid)
        );
        return {
            guid,
            title: result.title,
            items: result.items.map((item) =>
                mapPlaylistItemDtoApiToPlaylistItemDto(item)
            )
        };
    };

    const searchInPlaylistByGuid = async (
        guid: string,
        searchString: string
    ): Promise<GetSearchInPlaylistResult> => {
        return await handleApiCall(
            songsApi.songsControllerSearchInPlaylist(searchString, guid)
        );
    };

    const renamePlaylist = async (guid: string, title: string) => {
        return await handleApiCall(
            songsApi.songsControllerRenamePlaylist({ guid, title })
        );
    };

    const reorderPlaylist = async (
        guid: string,
        items: ApiReorderPlaylistItemDTO[]
    ) => {
        return await handleApiCall(
            songsApi.songsControllerReorderPlaylist({ guid, items })
        );
    };

    const setKeyChordOfItem = async (guid: string, keyChord: Chord) => {
        return await handleApiCall(
            songsApi.songsControllerTransposePlaylistItem({
                guid,
                key: keyChord.toString()
            })
        );
    };

    return {
        addVariantToPlaylist,
        removeVariantFromPlaylist,
        isVariantInPlaylist,
        getPlaylistsOfUser,
        createPlaylist,
        deletePlaylist,
        getPlaylistByGuid,
        searchInPlaylistByGuid,
        renamePlaylist,
        reorderPlaylist,
        setKeyChordOfItem
        // loading
    };
}
