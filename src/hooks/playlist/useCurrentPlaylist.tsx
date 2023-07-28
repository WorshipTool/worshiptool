import { createContext, useContext, useEffect, useState } from "react";
import usePlaylist from './usePlaylist';
import useAuth from "../auth/useAuth";


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

    const {isLoggedIn} = useAuth();

    useEffect(()=>{
        if(!isLoggedIn()) turnOff();
    },[isLoggedIn])

    
    const key = "currenPlaylist";
    const turnOn = (guid:string) => {
        setGuid(guid);
        
        localStorage.setItem(key, guid);
    }
    
    const turnOff = () => {
        setGuid(undefined);
        localStorage.removeItem(key)
    }
    useEffect(()=>{
        const loadedGuid = localStorage.getItem(key);
        if(loadedGuid==null)return;
        setGuid(loadedGuid)
    },[])
    return {
        isOn: guid!==undefined,
        turnOn, turnOff,
        ...playlist
    }
}