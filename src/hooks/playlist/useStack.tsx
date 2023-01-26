import { useSnackbar } from "notistack";
import React, { createContext, useContext, useEffect, useState } from "react";


export const stackContext = createContext<useProvideStackReturnI>({
    add: ()=>{},
    remove: ()=>{},
    songGUIDs: [],
    contains:()=>false,
    count:0,
    setGUIDs: ()=>{}
});

export const StackProvider = ({children}:{children:any}) => {
    const stack = useProvideStack();
    return <stackContext.Provider value={stack}>{children}</stackContext.Provider>
}

export default function useStack(){
    return useContext(stackContext);
}

export interface useProvideStackReturnI{
    add: (v:string)=>void,
    remove: (guid: string)=>void,
    songGUIDs: string[],
    contains: (g:string)=>boolean,
    count:number,
    setGUIDs: React.Dispatch<React.SetStateAction<string[]>>
}

export function useProvideStack():useProvideStackReturnI{

    const [guids, setGUIDs] = useState<string[]>([]); 

    const key = "playlistStack";

    const [loaded, setLoaded] = useState(false);

    useEffect(()=>{
        if(!loaded)return;
        localStorage.setItem(key, JSON.stringify(guids));
    },[guids])

    useEffect(()=>{
        const content = localStorage.getItem(key);
        if(content==null)return;

        setGUIDs(JSON.parse(content));
        setLoaded(true);
    },[])

    const add = (guid: string) => {
        setGUIDs((c)=>[...c, guid]);
    }

    const remove = (guid: string) => {
        setGUIDs((c)=>c.filter((g)=>g!=guid));
    }

    const contains = (guid:string) => {
        return guids.indexOf(guid)>=0;
    }

    return {
        add,
        remove,
        songGUIDs: guids,
        contains,
        count: guids.length,
        setGUIDs
    }
}