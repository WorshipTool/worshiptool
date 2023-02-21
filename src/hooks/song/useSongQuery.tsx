import { BACKEND_URL, GETSONGQUERY_URL } from "../../backend/constants";
import { RequestResult } from "../../backend/dtosRequestResult";
import { songGetQueryDTO, songGetResultDTO } from "../../backend/dtosSong";
import useFetch from "./../useFetch";

interface songQueryBaseProps{
    key:string,
    page:number

}

interface searchQueryProps extends songQueryBaseProps{
    key: "search",
    searchKey:string
}
interface randomQueryProps extends songQueryBaseProps{
    key: "random"
}
interface allQueryProps extends songQueryBaseProps{
    key: "all"
}
interface unverifiedQueryProps extends songQueryBaseProps{
    key: "unverified"
}
interface loadeUnverifiedQueryProps extends songQueryBaseProps{
    key: "loaderUnverified"
}

type useSongQueryProps = searchQueryProps|
                            randomQueryProps|
                            allQueryProps|
                            unverifiedQueryProps|
                            loadeUnverifiedQueryProps;

export function getQueryUrlWithParams(query: songGetQueryDTO){
    let params = "";

    const keys = Object.keys(query);

    const untyped : any = query;

    for(let i=0; i<keys.length; i++){
        let content = (untyped[keys[i]]);
        if(typeof(content)=="object"){
            content = JSON.stringify(content);
        }

        if(content!==undefined){
            let add = params==""?"":"&";
            add+=`${keys[i]}=${content}`;
    
            params+=add;
        }

    }

    const generatedURL = BACKEND_URL + GETSONGQUERY_URL + `?${params}`;
    return generatedURL;
}

export default function useSongQuery(startParams:Partial<useSongQueryProps>){
    const {fetchData} = useFetch();

    const getSongs = async (additionalParams:Partial<useSongQueryProps>) : Promise<RequestResult<songGetResultDTO>> => {

        const _params : any = {
            ...startParams,
            ...additionalParams
        }

        const params : useSongQueryProps = _params;
        const typed : songGetQueryDTO = params;

        const url = getQueryUrlWithParams(typed);

        const result : RequestResult<songGetResultDTO> = await new Promise((res, reject) => {
            fetchData({url},(result)=>{
                res(result);
            })
        });

        

        return result;
    }

    return getSongs;
}