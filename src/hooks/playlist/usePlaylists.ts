import { GetPlaylistsResultDTO, GetSongsInPlaylistResultDTO, PostAddVariantToPlaylistBodyDTO, PostCreatePlaylistBodyDTO, PostCreatePlaylistResultDTO, DeleteRemoveVariantFromPlaylistBodyDTO, PostDeletePlaylistBodyDTO } from '../../backend/dtos/dtosPlaylist';
import { getUrl_GETPLAYLISTS, getUrl_GETSONGSINPLAYLIST, getUrl_POSTADDTOPLAYLIST, getUrl_POSTCREATEPLAYLIST, getUrl_GETISVARIANTINPLAYLIST, getUrl_POSTREMOVEFROMPLAYLIST, getUrl_POSTDELETEPLAYLIST } from '../../backend/urls';
import useAuth from '../auth/useAuth';
import useFetch from '../useFetch';
import { RequestResult, isRequestSuccess, isRequestError, formatted } from '../../backend/dtos/RequestResult';
import Playlist from '../../models/playlist/playlist';


export default function usePlaylists(){
    const {fetchData, post} = useFetch();

    const addVariantToPlaylist = async (variant: string, playlist: string) => {
        const body : PostAddVariantToPlaylistBodyDTO = {playlist, variant};
        const result = await post({url: getUrl_POSTADDTOPLAYLIST(), body});
        return result;
    }

    const removeVariantFromPlaylist = async (variant:string, playlist: string) => {
        const body : DeleteRemoveVariantFromPlaylistBodyDTO = {playlist, variant};
        const result = await post({url: getUrl_POSTREMOVEFROMPLAYLIST(), body});
        console.log(result);
        return result;
    }

    const isVariantInPlaylist = async (variant: string, playlist: string) : Promise<boolean> => {
        const result = await fetchData<boolean>({url: getUrl_GETISVARIANTINPLAYLIST(variant, playlist)});
        // console.log(result);
        if(isRequestError(result)) return false;
        return result.data;
    }

    const getPlaylistsOfUser = async () : Promise<RequestResult<GetPlaylistsResultDTO>> => {
        const result = await fetchData<GetPlaylistsResultDTO>({url: getUrl_GETPLAYLISTS()})
        return result;
    }

    const createPlaylist = async (title:string) => {
        const body : PostCreatePlaylistBodyDTO = {title}
        const result = await post({url: getUrl_POSTCREATEPLAYLIST(), body})
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
        return await fetchData<GetSongsInPlaylistResultDTO>({url: getUrl_GETSONGSINPLAYLIST({guid})})
        
    }

    const getPlaylistByGuid = async (guid: string) : Promise<RequestResult<Playlist>> => {
        const result = await getSongsInPlaylist(guid);
        if(isRequestError(result)){
            return formatted(null, result.statusCode, result.message);
        }
        
        return formatted({
            guid:guid,
            title:result.data.title,
            variants: result.data.guids

        });
    }


    return {
        addVariantToPlaylist,
        removeVariantFromPlaylist,
        isVariantInPlaylist,
        getPlaylistsOfUser,
        createPlaylist,
        deletePlaylist,
        getPlaylistByGuid
    }
}