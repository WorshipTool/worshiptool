import { useEffect, useMemo, useState } from "react";
import usePlaylists from "./usePlaylists";
import Playlist, { PlaylistItemDTO } from "../../interfaces/playlist/PlaylistDTO";
import { RequestResult, isRequestSuccess } from "../../apis/dtos/RequestResult";
import { VariantDTO } from "../../interfaces/variant/VariantDTO";
import { mapApiToVariant } from "../../apis/dtos/variant/mapApiToVariant";
import { mapApiToPlaylistItemDTO } from "../../apis/dtos/playlist/ApiPlaylisItemMap";
import { ApiPlaylistItemDTO } from "../../apis/dtos/playlist/ApiPlaylistItemDTO";
import { ApiReorderPlaylistItemDTO } from "../../apis/dtos/playlist/dtosPlaylist";
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
        getPlaylistByGuid(guid)
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
    const removeVariant = (variant: string) => {
        return removeVariantFromPlaylist(variant, guid).then((r)=>{
            if(isRequestSuccess(r)){
                reload();
            }
            return r;
        });
    }
    const rename = (title: string) => {
        renamePlaylistByGuid(guid||"", title).then((r)=>{
            if(isRequestSuccess(r)){
                reload();
            }
        });
    }

    const reorder = (items: ApiReorderPlaylistItemDTO[]) => {
        reorderPlaylist(guid||"", items).then((r)=>{
            if(isRequestSuccess(r)){
                reload();
            }else{
                console.error(r);
            }
        });
    }

    const setItemsKeyChord = (item: PlaylistItemDTO, keyChord: Chord) => {
        setKeyChordOfItem(item.guid, keyChord);
        
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