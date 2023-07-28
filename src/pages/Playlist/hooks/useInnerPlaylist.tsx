import { createContext, useContext, useEffect, useState } from "react";
import usePlaylist from "../../../hooks/playlist/usePlaylist";
import useCurrentPlaylist from "../../../hooks/playlist/useCurrentPlaylist";


export const innerPlaylistContext = createContext<useProvidePlaylistI>({} as useProvidePlaylistI);

export default function useInnerPlaylist(){
    return useContext(innerPlaylistContext)
}

export const InnerPlaylistProvider = ({children, guid}: {children: any, guid:string}) => {
    const p = useProvideInnerPlaylist(guid);

    return <innerPlaylistContext.Provider value={p}>{children}</innerPlaylistContext.Provider>
}

interface useProvidePlaylistI extends ReturnType<typeof usePlaylist>{
    isOn: boolean
}

export const useProvideInnerPlaylist = (guid:string) : useProvidePlaylistI => {
    const playlist = usePlaylist(guid);

    const {playlist: currentPlaylist, reload} = useCurrentPlaylist();

    useEffect(()=>{
        if(guid!==undefined&&currentPlaylist?.guid===guid){
            reload();
        }
    },[guid, currentPlaylist, playlist])

    return {
        isOn: guid!==undefined,
        ...playlist
    }
}