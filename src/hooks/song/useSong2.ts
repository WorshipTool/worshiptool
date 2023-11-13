import { useEffect, useState } from "react";
import useFetch from '../useFetch';
import { getUrl_GETSONGBYGUID } from "../../api/urls";
import AllSongDataDTO from "../../api/dtos/dtosSong";
import useAuth from "../auth/useAuth";
import { isRequestSuccess } from "../../api/dtos/RequestResult";

/**
 * Hook provides basic information about song. 
 * Song is chosen by guid. Please set guid at beginning, or use can use setGuid function
 */
export default function useSong(_guid?: string) {
    const [guid, setGuid] = useState(_guid);

    const {fetchData} = useFetch();
    const [data, setData] = useState<AllSongDataDTO>();

    const {user, isLoggedIn} = useAuth();


    /**
     * Reload song data
     */
    useEffect(()=>{
        reload();
    },[guid]);

    /**
     * This function reloads song data from current guid. 
     * The result is set to data state variable.
     */
    const reload = async () : Promise<AllSongDataDTO> => {

        if(!guid) throw("Song is undefined");

        const res = await fetchData<AllSongDataDTO>({url: getUrl_GETSONGBYGUID(guid)});
        if(isRequestSuccess(res)){

            setData(res.data);
            //convertAllSongDataDTOToSong

            return res.data;
        }

        throw("Error");
    }

    const getTitle = () : string => {     
        //guid not set  
        if(!guid) throw("Song is undefined"); 
        if(!data) throw("Song not found");

        // if(data.alternativeTitles?.length>0) 
        //     return data.alternativeTitles[0];

        throw("Song has no title");
    }





    return {
        setGuid,
        getTitle
    }

    
}
