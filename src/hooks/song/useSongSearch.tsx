import { SongsApi } from '../../api/generated';
import { handleApiCall } from '../../tech/handleApiCall';


type useSongSearchProps = {
    searchKey:string,
    page?: number,
    signal?: AbortSignal
}


export default function useSongSearch(){

    const getSongs = async (additionalParams:useSongSearchProps) => {

        const songApi = new SongsApi();
        try{
            const result = await handleApiCall(songApi.songsControllerGetBySearch(additionalParams.searchKey, additionalParams.page || 0, {
                signal: additionalParams.signal
            }));
            return result;
        }catch(e){
            console.log(e);
        }
        // const _params : any = {
        //     ...additionalParams
        // }

        // //spaces in searchKey
        // if(_params.searchKey){
        //     const searchKey : string = _params.searchKey;
        //     _params.searchKey = searchKey.replace(/\s/g, '_');
        // }
        // const params : useSongSearchProps = _params;

        // const url = BACKEND_URL+GETSONGSEARCH_URL+"?searchKey="+params.searchKey;

        // const result : RequestResult<SongSearchResultDTO> = await new Promise((res, reject) => {
        //     fetchData<SongSearchResultDTO>({url},(result)=>{
        //         res(result);
        //     })
        // });

        

        return {songs:[]};
    }

    return getSongs;
}