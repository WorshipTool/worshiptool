import { useState } from "react";
import useAuth from "./auth/useAuth";
import { RequestError, RequestResult, codes, formatted, messages } from "../api/dtos/RequestResult";
import { useSnackbar } from "notistack";
import { FetchParams, fetchData as fetchDataFunction } from "../tech/fetchHelpers";



export default function useFetch(){
    const [data, setData] = useState<any>();
    const [error, setError] = useState<any>();
    const [message, setMessage] = useState<string>("");
    const [statusCode, setStatusCode] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const {getAuthHeader} = useAuth();

    const post = async (params: FetchParams, after?: (d:RequestResult<any>)=>void) => {
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params.body)
        };


        return await fetchData({...params, options: requestOptions}, after)
    }

    interface PostFormDataParams extends FetchParams{
        body: FormData
    }
    const postFormData = async (params: PostFormDataParams, after?: (d:RequestResult<any>)=>void) => {

        const requestOptions = {
            method: 'POST',
            body: params.body
        };




        return await _fetchData({...params, options: requestOptions}, after, false)
    }

    const fetchData = async <T>(params: FetchParams, after?: (d:RequestResult<T>)=>void)=>{
        return _fetchData<T>(params, after);
    }
    const _fetchData = async <T>(params: FetchParams, after?: (d:RequestResult<T>)=>void, stringifyBody = true)=>{

        //create options with header
        const headers = {
            ...getAuthHeader()
        };
        let newOptions = {headers: headers};
        if(params.options){
            newOptions = {...params.options, headers: {...params.options.headers, ...headers}};
        }

        try{
            setLoading(true);
            const response = await fetchDataFunction({...params, options: newOptions},stringifyBody);
            const data : RequestResult<T> = await response.json();
    
            if(data.statusCode===undefined){
                //Backend returned nothing, or invalid format
                setError(data);
                setMessage(messages["Unknown Error"]);
                setStatusCode(codes["Unknown Error"]);
                if(after)after(RequestError as RequestResult<T>);

    
            }else if(data.statusCode&&data.statusCode>=400){
                //Backend returned an error.
                setError(data.message);
                setMessage(data.message);
                setStatusCode(data.statusCode);
                setLoading(false);
                if(after)after(data);
    
    
            }else{
                //successful fetch
                setData(data.data);
                setMessage(data.message);
                setStatusCode(data.statusCode);
                setError(null);
                setLoading(false);
                if(after)after(data);
            }

            return data;
        }catch(e){
            // enqueueSnackbar("Náš server mele nesmysly. Omlouváme, chvilku potrvá než to vyluštíme.",{
            //     preventDuplicate:true,
            //     autoHideDuration: 10000
            // });

            setLoading(false);
            setError(e);
            setData(null);
            setStatusCode(codes["Unknown Error"]);
            setMessage(messages["Unknown Error"]);

            if(after)after(RequestError as RequestResult<T>);

            return RequestError as RequestResult<T>;
        }
        


    }

    return {
        fetchData: fetchData, post,
        fetch: fetchData,
        postFormData,
        data, error, loading,
        message, statusCode
    }


}