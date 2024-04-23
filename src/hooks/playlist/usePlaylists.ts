import { ApiReorderPlaylistItemDTO } from "../../api/dtos/playlist/dtosPlaylist";
import useAuth from "../auth/useAuth";
import Playlist from "../../interfaces/playlist/PlaylistDTO";
import { Chord } from "@pepavlin/sheet-api";
import {
    GetSearchInPlaylistResult,
    PlaylistEditingApi,
    PlaylistGettingApi
} from "../../api/generated";
import { handleApiCall } from "../../tech/handleApiCall";
import { useApi } from "../api/useApi";
import { mapPlaylistItemOutDtoApiToPlaylistItemDto } from "../../api/dtos/playlist/playlist.map";

export default function usePlaylists() {
    // const {fetchData, post, loading} = useFetch();

    // const { playlistEditingApi, playlistGettingApi } = useApi();
    const { apiConfiguration } = useAuth();
    const playlistEditingApi = new PlaylistEditingApi(apiConfiguration);
    const playlistGettingApi = new PlaylistGettingApi(apiConfiguration);

    const addVariantToPlaylist = async (
        variantAlias: string,
        playlist: string
    ) => {
        return await handleApiCall(
            playlistEditingApi.playlistEditingControllerAddVariantToPlaylist({
                playlist,
                alias: variantAlias
            })
        );
    };

    const removeVariantFromPlaylist = async (
        variantAlias: string,
        playlist: string
    ) => {
        return await handleApiCall(
            playlistEditingApi.playlistEditingControllerRemoveVariantFromPlaylistDelete(
                variantAlias,
                playlist
            )
        );
    };

    const isVariantInPlaylist = async (
        variantAlias: string,
        playlist: string
    ): Promise<boolean> => {
        const result = await handleApiCall(
            playlistGettingApi.playlistGettingControllerIsVariantInPlaylist(
                variantAlias,
                playlist
            )
        );

        return result;
    };

    const getPlaylistsOfUser = async () => {
        return await handleApiCall(
            playlistGettingApi.playlistGettingControllerGetPlaylistsOfUser()
        );
    };

    const createPlaylist = async (title?: string) => {
        if (!title) title = "Nový playlist";
        return await handleApiCall(
            playlistEditingApi.playlistEditingControllerCreatePlaylist({
                title
            })
        );
    };

    const deletePlaylist = async (guid: string) => {
        return await handleApiCall(
            playlistEditingApi.playlistEditingControllerDeletePlaylist(guid)
        );
    };

    const getPlaylistByGuid = async (guid: string): Promise<Playlist> => {
        const result = await handleApiCall(
            playlistGettingApi.playlistGettingControllerGetPlaylistDataByGuid(
                guid
            )
        );
        return {
            guid,
            title: result.title,
            items: result.items.map((item) =>
                mapPlaylistItemOutDtoApiToPlaylistItemDto(item)
            ),
            ownerGuid: result.ownerGuid
        };
    };

    const searchInPlaylistByGuid = async (
        guid: string,
        searchString: string
    ): Promise<GetSearchInPlaylistResult> => {
        return await handleApiCall(
            playlistGettingApi.playlistGettingControllerSearchInPlaylist(
                searchString,
                guid
            )
        );
    };

    const renamePlaylist = async (guid: string, title: string) => {
        return await handleApiCall(
            playlistEditingApi.playlistEditingControllerRenamePlaylist({
                guid,
                title
            })
        );
    };

    const reorderPlaylist = async (
        guid: string,
        items: ApiReorderPlaylistItemDTO[]
    ) => {
        return await handleApiCall(
            playlistEditingApi.playlistEditingControllerReorderPlaylist({
                guid,
                items
            })
        );
    };

    const setKeyChordOfItem = async (guid: string, keyChord: Chord) => {
        return await handleApiCall(
            playlistEditingApi.playlistEditingControllerTransposePlaylistItem({
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
