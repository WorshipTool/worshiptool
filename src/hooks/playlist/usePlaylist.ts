import { useEffect, useState } from "react";
import usePlaylists from "./usePlaylists";
import Playlist from "../../models/playlist/playlist";
import { isRequestSuccess } from "../../backend/dtos/RequestResult";

export default function usePlaylist(guid:string){
    const {addVariantToPlaylist, removeVariantFromPlaylist, getPlaylistByGuid} = usePlaylists();

    const [playlist, setPlaylist] = useState<Playlist>();
    const [variantGuids, setVariantGuids] = useState<string[]>([]);

    useEffect(()=>{
        reload();
    },[])

    const reload = () => {
        getPlaylistByGuid(guid)
        .then((r)=>{
            if(isRequestSuccess(r)){
                setPlaylist(r.data);
                setVariantGuids(r.data.variants);
            }
        });
    }

    const addVariant = (variant: string) => addVariantToPlaylist(variant, guid);
    const removeVariant = (variant: string) => removeVariantFromPlaylist(variant, guid);
    return {
        addVariant,
        removeVariant,
        playlist, 
        variants: variantGuids,
        reload
    }
}