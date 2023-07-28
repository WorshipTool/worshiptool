import { BACKEND_URL, GETSONGQUERY_URL } from "../../apis/constants";
import { RequestResult } from "../../apis/dtos/RequestResult";
import { SearchSongDataDTO, SongSearchResultDTO, songGetQueryDTO, songGetResultDTO } from "../../apis/dtos/dtosSong";
import useFetch from "./../useFetch";

interface songQueryBaseProps{
    key:string,
    page:number

}

// interface searchQueryProps extends songQueryBaseProps{
//     key: "search",
//     searchKey:string
// }
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

type useSongQueryProps = randomQueryProps|
                        allQueryProps|
                        unverifiedQueryProps|
                        loadeUnverifiedQueryProps;


export default function useSongQuery(startParams:Partial<useSongQueryProps>) {
    const {fetchData} = useFetch();

    const getSongs = async (additionalParams:Partial<useSongQueryProps>) : Promise<RequestResult<SongSearchResultDTO>> => {

        const _params : any = {
            ...startParams,
            ...additionalParams
        }

        //spaces in searchKey
        if(_params.searchKey){
            const searchKey : string = _params.searchKey;
            _params.searchKey = searchKey.replace(/\s/g, '_');
        }
        const params : useSongQueryProps = _params;

        const typed : songGetQueryDTO = params;

        const url = BACKEND_URL + GETSONGQUERY_URL;

        const result : RequestResult<SongSearchResultDTO> = await new Promise((res, reject) => {
            fetchData<SongSearchResultDTO>({url, params: typed},(result)=>{
                res(result);
            })
        });


        

        return result;
    }

    return getSongs;
}