import { createContext, useContext, useEffect, useState } from "react";
import usePlaylist from './usePlaylist';


export const playlistContext = createContext<useProvidePlaylistI>({} as useProvidePlaylistI);

export default function useCurrentPlaylist(){
    return useContext(playlistContext)
}

export const PlaylistProvider = ({children}: {children: any}) => {
    const p = useProvidePlaylist();

    return <playlistContext.Provider value={p}>{children}</playlistContext.Provider>
}

interface useProvidePlaylistI extends ReturnType<typeof usePlaylist>{
    isOn: boolean,
    turnOn: (guid:string) => void,
    turnOff: ()=>void
}

export const useProvidePlaylist = () : useProvidePlaylistI => {
    const [guid, setGuid] = useState<string>();
    const playlist = usePlaylist(guid);
    const turnOn = (guid:string) => {
        setGuid(guid);
    }

    const turnOff = () => {
        setGuid(undefined);
    }
    return {
        isOn: guid!==undefined,
        turnOn, turnOff,
        ...playlist
    }
}