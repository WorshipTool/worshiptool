import { useEffect, useMemo, useState } from "react";
import usePlaylists from "./usePlaylists";
import Playlist, { PlaylistItemDTO } from "../../interfaces/playlist/PlaylistDTO";
import { RequestResult, isRequestSuccess } from "../../api/dtos/RequestResult";
import { VariantDTO } from "../../interfaces/variant/VariantDTO";
import { mapApiToVariant } from "../../api/dtos/variant/mapApiToVariant";
import { mapApiToPlaylistItemDTO } from "../../api/dtos/playlist/ApiPlaylisItemMap";
import { ApiPlaylistItemDTO } from "../../api/dtos/playlist/ApiPlaylistItemDTO";
import { ApiReorderPlaylistItemDTO } from "../../api/dtos/playlist/dtosPlaylist";
import { Chord } from "@pepavlin/sheet-api";
import useAuth from "../auth/useAuth";

// interface usePlaylistI{
//     addVariant: (variant: string) => Promise<RequestResult<any>>,
//     removeVariant: (variant: string) => Promise<RequestResult<any>>,
//     playlist: Playlist | undefined,
//     items: PlaylistItemDTO[],
//     reload: () => void,
//     search: (searchString: string) => void,
//     count: number,
//     guid: string,
//     rename: (title: string) => void,
//     reorder: (items: ApiReorderPlaylistItemDTO[]) => void,
//     loading: boolean
// }

export default function usePlaylist(guid:string | undefined){
    const {
        addVariantToPlaylist, 
        removeVariantFromPlaylist, 
        getPlaylistByGuid,
        searchInPlaylistByGuid,
        renamePlaylist : renamePlaylistByGuid,
        reorderPlaylist,
        setKeyChordOfItem
    } = usePlaylists();

    const [playlist, setPlaylist] = useState<Playlist>();
    const [items, setItems] = useState<PlaylistItemDTO[]>([]);

    const [count, setCount] = useState(0);

    const [loading, setLoading] = useState(true);

    const {isLoggedIn, user} = useAuth();

    useEffect(()=>{
        if(!guid)return;
        reload();
    },[guid])

    const reload = () => {
        if(!guid)return;
        return getPlaylistByGuid(guid)
        .then((r)=>{
            if(isRequestSuccess(r)){
                setPlaylist(r.data);
                setItems(r.data.items);
                setCount(r.data.items.length)
            }
            setLoading(false);
        });
    }

    const search = async (searchString: string) => {
        if(!guid)return;
        const result = await searchInPlaylistByGuid(guid, searchString);
        if(isRequestSuccess(result)){

            setItems(result.data.items.map((v)=>mapApiToPlaylistItemDTO(v)));
        }
    }

    const addVariant = (variant: string) => {
       return addVariantToPlaylist(variant, guid).then((r)=>{
            if(isRequestSuccess(r)){
                reload();
            }
            return r;
        });
    };
    const removeVariant = async (variant: string) => {
        const r = await removeVariantFromPlaylist(variant, guid)
        if(isRequestSuccess(r)){
            await reload();
        }
        return r;
    }
    const rename = (title: string) => {
        return renamePlaylistByGuid(guid||"", title).then((r)=>{
            if(isRequestSuccess(r)){
                reload();
            }
        });
    }

    const reorder = async (items: ApiReorderPlaylistItemDTO[]) => {
        const r = await reorderPlaylist(guid||"", items)

        if(isRequestSuccess(r)){
            await reload();
        }else{
            console.error(r);
        }

        return r;
    }

    const setItemsKeyChord = (item: PlaylistItemDTO, keyChord: Chord) => {
        return setKeyChordOfItem(item.guid, keyChord);
        
    }

    const isOwner = useMemo(()=>isLoggedIn(),[user, isLoggedIn])



    return {
        addVariant,
        removeVariant,
        rename,
        playlist, 
        items,
        reload,
        search,
        count,
        guid: playlist?.guid || "undefined",
        reorder,
        loading,
        setItemsKeyChord,
        isOwner
    }
}