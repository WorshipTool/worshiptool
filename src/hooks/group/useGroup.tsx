import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { isRequestSuccess } from "../../api/dtos/RequestResult";
import { Group } from "../../interfaces/group/Group";
import { ApiGroupDto } from "../../api/dtos/group/ApiGroupDto";
import { mapApiToGroup } from "../../api/dtos/group/ApiGroupMap";
import useGroupSelection from "./useGroupSelection";
import useAuth from "../auth/useAuth";

export const groupContext = createContext<useProvideGroupI>({} as useProvideGroupI);

export default function useGroup(){
    return useContext(groupContext);
}

export const GroupProvider = ({children}:{children:any}) => {
    const auth = useProvideGroup();

    
    return <groupContext.Provider value={auth}>{children}</groupContext.Provider>
}

interface useProvideGroupI{
    name: string,
    guid: string,
    selectionGuid: string,
    turnOn: (name: string)=>void,
    turnOff: ()=>void,
    isOn: boolean,
    url: string
} 

export const useProvideGroup = () : useProvideGroupI => {
    const {fetchData} = useFetch();

    const [group, setGroup] = useState<Group>();

    const {isLoggedIn} = useAuth();

    const navigate = useNavigate();

    const key = "activeGroup";


    const turnOn = (name: string) => {
        if(!isLoggedIn()) return;
        fetchData<ApiGroupDto>({url: "/group", params: {name:name}}).then((r)=>{
            if(isRequestSuccess(r)){
                setGroup( mapApiToGroup(r.data) );
                localStorage.setItem(key, name);
            };
        });
    }
    const turnOff = () => {
        setGroup(undefined);
        localStorage.removeItem(key);
    }

    // useEffect(()=>{
    //     const u = localStorage.getItem("user");
    //     if(!u){ 
    //         turnOff();
    //         navigate("/");
    //     }
    // },[])

    useEffect(()=>{

        

        if(!isLoggedIn()) return;
        const activeName = localStorage.getItem(key);
        if(!activeName) return;
        turnOn(activeName)
    },[isLoggedIn])

    return {
        turnOn, turnOff, isOn : group!==undefined,
        name: group?.name || "",
        guid: group?.guid || "",
        selectionGuid: group?.selection || "",
        url: "/group/"+group?.name || ""

    }
}

