import { BACKEND_URL, GETSONGQUERY_URL, GETSONGSEARCH_URL } from '../../apis/constants';
import { RequestResult } from "../../apis/dtos/RequestResult";
import { songGetQueryDTO, songGetResultDTO, SongSearchResultDTO } from '../../apis/dtos/dtosSong';
import useFetch from "../useFetch";


type useSongSearchProps = {
    key: "search",
    searchKey:string,
    page: number
}


export default function useSongSearch(){
    const {fetchData} = useFetch();

    const getSongs = async (additionalParams:Partial<useSongSearchProps>) : Promise<RequestResult<SongSearchResultDTO>> => {

        const _params : any = {
            ...additionalParams
        }

        //spaces in searchKey
        if(_params.searchKey){
            const searchKey : string = _params.searchKey;
            _params.searchKey = searchKey.replace(/\s/g, '_');
        }
        const params : useSongSearchProps = _params;

        const url = BACKEND_URL+GETSONGSEARCH_URL+"?searchKey="+params.searchKey;

        const result : RequestResult<SongSearchResultDTO> = await new Promise((res, reject) => {
            fetchData<SongSearchResultDTO>({url},(result)=>{
                res(result);
            })
        });

        

        return result;
    }

    return getSongs;
}