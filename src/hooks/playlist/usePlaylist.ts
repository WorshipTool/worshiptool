import { useEffect, useState } from "react";
import usePlaylists from "./usePlaylists";
import Playlist from "../../interfaces/playlist/playlist";
import { isRequestSuccess } from "../../apis/dtos/RequestResult";
import { VariantDTO } from "../../interfaces/variant/VariantDTO";

export default function usePlaylist(guid:string | undefined){
    const {addVariantToPlaylist, removeVariantFromPlaylist, getPlaylistByGuid} = usePlaylists();

    const [playlist, setPlaylist] = useState<Playlist>();
    const [variants, setVariants] = useState<VariantDTO[]>([]);

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
                setVariants(r.data.variants);
            }
        });
    }

    const addVariant = (variant: string) => addVariantToPlaylist(variant, guid);
    const removeVariant = (variant: string) => removeVariantFromPlaylist(variant, guid);
    return {
        addVariant,
        removeVariant,
        playlist, 
        variants: variants,
        reload
    }
}