import { useEffect, useState } from "react";
import usePlaylists from "./usePlaylists";
import Playlist from "../../interfaces/playlist/playlist";
import { RequestResult, isRequestSuccess } from "../../apis/dtos/RequestResult";
import { VariantDTO } from "../../interfaces/variant/VariantDTO";
import { mapApiToVariant } from "../../apis/dtos/variant/mapApiToVariant";

interface usePlaylistI{
    addVariant: (variant: string) => Promise<RequestResult<any>>,
    removeVariant: (variant: string) => Promise<RequestResult<any>>,
    playlist: Playlist | undefined,
    variants: VariantDTO[],
    reload: () => void,
    search: (searchString: string) => void,
    count: number,
    guid: string
}

export default function usePlaylist(guid:string | undefined) : usePlaylistI{
    const {
        addVariantToPlaylist, 
        removeVariantFromPlaylist, 
        getPlaylistByGuid,
        searchInPlaylistByGuid
    } = usePlaylists();

    const [playlist, setPlaylist] = useState<Playlist>();
    const [variants, setVariants] = useState<VariantDTO[]>([]);

    const [count, setCount] = useState(0);

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
                setCount(r.data.variants.length)
            }
        });
    }

    const search = async (searchString: string) => {
        if(!guid)return;
        const result = await searchInPlaylistByGuid(guid, searchString);
        if(isRequestSuccess(result)){
            setVariants(result.data.map((v)=>{
                const m = mapApiToVariant(v.variant);
                return m;
            }));
        }
    }

    const addVariant = (variant: string) => addVariantToPlaylist(variant, guid);
    const removeVariant = (variant: string) => removeVariantFromPlaylist(variant, guid);
    return {
        addVariant,
        removeVariant,
        playlist, 
        variants,
        reload,
        search,
        count,
        guid: playlist?.guid || "undefined"
    }
}