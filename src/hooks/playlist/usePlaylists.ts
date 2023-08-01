import { GetPlaylistsResultDTO, GetSongsInPlaylistResultDTO, PostAddVariantToPlaylistBodyDTO, PostCreatePlaylistBodyDTO, PostCreatePlaylistResultDTO, DeleteRemoveVariantFromPlaylistBodyDTO, PostDeletePlaylistBodyDTO, GetSearchInPlaylistResultDTO } from '../../apis/dtos/playlist/dtosPlaylist';
import { getUrl_GETPLAYLISTS, getUrl_GETSONGSINPLAYLIST, getUrl_POSTADDTOPLAYLIST, getUrl_POSTCREATEPLAYLIST, getUrl_GETISVARIANTINPLAYLIST, getUrl_POSTREMOVEFROMPLAYLIST, getUrl_POSTDELETEPLAYLIST } from '../../apis/urls';
import useAuth from '../auth/useAuth';
import useFetch from '../useFetch';
import { RequestResult, isRequestSuccess, isRequestError, formatted, codes } from '../../apis/dtos/RequestResult';
import Playlist from '../../interfaces/playlist/PlaylistDTO';
import { mapApiToVariant } from '../../apis/dtos/variant/mapApiToVariant';
import { mapApiToPlaylistItemDTO } from '../../apis/dtos/playlist/ApiPlaylisItemMap';


export default function usePlaylists(){
    const {fetchData, post} = useFetch();

    const addVariantToPlaylist = async (variant: string | undefined, playlist: string | undefined) => {
        if(!variant || !playlist) return formatted(null, codes['Unknown Error'], "Invalid parameters");

        const body : PostAddVariantToPlaylistBodyDTO = {playlist, variant};
        const result = await post({url: getUrl_POSTADDTOPLAYLIST(), body});
        console.log(result);
        return result;
    }

    const removeVariantFromPlaylist = async (variant:string | undefined, playlist: string | undefined) => {
        if(!variant || !playlist) return formatted(null, codes['Unknown Error'], "Invalid parameters");
        const body : DeleteRemoveVariantFromPlaylistBodyDTO = {playlist, variant};
        const result = await post({url: getUrl_POSTREMOVEFROMPLAYLIST(), body});
        return result;
    }

    const isVariantInPlaylist = async (variant: string, playlist: string) : Promise<boolean> => {
        const result = await fetchData<boolean>({url: getUrl_GETISVARIANTINPLAYLIST(variant, playlist)});
        if(isRequestError(result)) return false;
        return result.data;
    }

    const getPlaylistsOfUser = async () : Promise<RequestResult<GetPlaylistsResultDTO>> => {
        const result = await fetchData<GetPlaylistsResultDTO>({url: getUrl_GETPLAYLISTS()})
        return result;
    }

    const createPlaylist = async (title?:string) => {
        if(!title)title="Nový playlist";
        const body : PostCreatePlaylistBodyDTO = {title}
        const result : RequestResult<PostCreatePlaylistResultDTO> = await post({url: getUrl_POSTCREATEPLAYLIST(), body})
        return result;
    }

    const deletePlaylist = async (guid:string) => {
        const body: PostDeletePlaylistBodyDTO = {
            guid
        }
        const result = await post({url: getUrl_POSTDELETEPLAYLIST(), body});
        return result;
    }

    const getSongsInPlaylist = async (guid:string) => {
        return await fetchData<GetSongsInPlaylistResultDTO>({url: "/songs/playlist", params: {guid}})
        
    }

    const getPlaylistByGuid = async (guid: string) : Promise<RequestResult<Playlist>> => {
        const result = await getSongsInPlaylist(guid);

        if(isRequestError(result)){
            return formatted(null, result.statusCode, result.message);
        }
        
        return formatted({
            guid:guid,
            title:result.data.title,
            items: result.data.items.map(item => mapApiToPlaylistItemDTO(item))

        });
    }

    const searchInPlaylistByGuid = async (guid: string, searchString: string) : Promise<RequestResult<GetSearchInPlaylistResultDTO>> => {
        const result =  await fetchData<GetSearchInPlaylistResultDTO>({url: "/songs/playlist/search", params: {guid, searchKey: searchString}});
        return result;
    }

    const renamePlaylist = async (guid: string, title: string) => {
        const result = await post({url: "/songs/playlist/rename", body: {guid, title}});
        return result
    }


    return {
        addVariantToPlaylist,
        removeVariantFromPlaylist,
        isVariantInPlaylist,
        getPlaylistsOfUser,
        createPlaylist,
        deletePlaylist,
        getPlaylistByGuid,
        searchInPlaylistByGuid,
        renamePlaylist
    }
}