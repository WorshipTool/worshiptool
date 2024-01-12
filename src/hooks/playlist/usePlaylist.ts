import { useEffect, useMemo, useState } from "react";
import usePlaylists from "./usePlaylists";
import Playlist, { PlaylistItemDTO } from "../../interfaces/playlist/PlaylistDTO";
import { mapApiToPlaylistItemDTO } from "../../api/dtos/playlist/ApiPlaylisItemMap";
import { ApiPlaylistItemDTO } from "../../api/dtos/playlist/ApiPlaylistItemDTO";
import { ApiReorderPlaylistItemDTO } from "../../api/dtos/playlist/dtosPlaylist";
import { Chord } from "@pepavlin/sheet-api";
import useAuth from "../auth/useAuth";

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
            setPlaylist(r);
            setItems(r.items);
            setCount(r.items.length)
            setLoading(false);
        })
        .catch((e)=>{
            console.error(e);
            setLoading(false);
        });
    }

    const search = async (searchString: string) => {
        if(!guid)return;
        searchInPlaylistByGuid(guid, searchString)
        .then((r)=>{
            console.log(r);
            setItems(r.items.map((v)=>mapApiToPlaylistItemDTO(v)));
        })
        .catch((e)=>{
            console.error(e);
        });
    }

    const addVariant = (variant: string) : Promise<boolean> => {
        if(!guid){
            console.error("Guid is undefined");
            return Promise.reject();
        }

       return addVariantToPlaylist(variant, guid).then(async (r)=>{
            await reload();
            return r;
        });
    };
    const removeVariant = async (variant: string) : Promise<boolean>  => {
        if(!guid){
            console.error("Guid is undefined");
            return Promise.reject();
        }

        const r = await removeVariantFromPlaylist(variant, guid)
        await reload();
        return r;
    }
    const rename = (title: string) => {
        return renamePlaylistByGuid(guid||"", title).then((r)=>{
            reload();
        });
    }

    const reorder = async (items: ApiReorderPlaylistItemDTO[]) => {
        const r = await reorderPlaylist(guid||"", items)

        await reload();

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