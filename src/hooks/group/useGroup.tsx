import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const groupContext = createContext<useProvideGroupI>({} as useProvideGroupI);

export default function useGroup(){
    return useContext(groupContext);
}

export const GroupProvider = ({children}:{children:any}) => {
    const auth = useProvideGroup();
    return <groupContext.Provider value={auth}>{children}</groupContext.Provider>
}

interface useProvideGroupI{
    isGroup: boolean,
    name: string | undefined,
    setGroupName: (a:string|undefined)=>void,
    fullName: string | undefined,
    baseUrl: string
} 

export const useProvideGroup = () : useProvideGroupI => {
    const [groupName, setGroupName] = useState<string|undefined>();
    const [isGroup, setIsGroup] = useState(false);
    useEffect(()=>{
        setIsGroup(groupName!==undefined);
    },[groupName])

    return {
        isGroup,
        name: groupName,
        setGroupName,
        fullName: "CB Třináctka",
        baseUrl: (isGroup? `/group/${groupName}`: "")

    }
}