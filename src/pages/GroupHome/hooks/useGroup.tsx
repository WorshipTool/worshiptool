import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { isRequestSuccess } from "../../../apis/dtos/RequestResult";
import { Group } from "../../../interfaces/group/Group";
import { ApiGroupDto } from "../../../apis/dtos/group/ApiGroupDto";
import { mapApiToGroup } from "../../../apis/dtos/group/ApiGroupMap";
import useGroupSelection from "./useGroupSelection";

export const groupContext = createContext<useProvideGroupI>({} as useProvideGroupI);

export default function useGroup(){
    return useContext(groupContext);
}

export const GroupProvider = ({children}:{children:any}) => {
    const auth = useProvideGroup();

    
    return <groupContext.Provider value={auth}>{children}</groupContext.Provider>
}

interface useProvideGroupI{
    defined: boolean,
    name: string,
    guid: string,
    selectionGuid: string,
} 

export const useProvideGroup = () : useProvideGroupI => {
    const {groupName} = useParams();
    const {fetchData} = useFetch();

    const [group, setGroup] = useState<Group>();

    useEffect(()=>{
        fetchData<ApiGroupDto>({url: "/group", params: {name:groupName}}).then((r)=>{
            if(isRequestSuccess(r)){
                setGroup( mapApiToGroup(r.data) );
            };
        });

    },[])
    return {
        defined: group!==undefined,
        name: group?.name || "",
        guid: group?.guid || "",
        selectionGuid: group?.selection || "",

    }
}

