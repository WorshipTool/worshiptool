import { createContext, useContext, useEffect, useState } from "react";
import usePlaylist from "../../../hooks/playlist/usePlaylist";


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

    return {
        isOn: guid!==undefined,
        ...playlist
    }
}