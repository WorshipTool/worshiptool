import { useState } from "react";
import useAuth from "./auth/useAuth";
import { RequestError, RequestResult, codes, formatted, messages } from "../backend/dtos/RequestResult";
import { useSnackbar } from "notistack";



export default function useFetch(){
    const [data, setData] = useState<any>();
    const [error, setError] = useState<any>();
    const [message, setMessage] = useState<string>("");
    const [statusCode, setStatusCode] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const {enqueueSnackbar} = useSnackbar();

    const {user, getAuthHeader} = useAuth();

    const post = async ({url, body}: {url:string, body?: any}, after?: (d:RequestResult<any>)=>void) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };


        return await fetchData({url, options: requestOptions}, after)
    }

    const fetchData = async <T>({url, options}:{url:string, options?:any}, after?: (d:RequestResult<T>)=>void)=>{

        //create options with header
        const authHeader = {...getAuthHeader()};
        let newOptions = {headers: authHeader};
        if(options){
            newOptions = {...options, headers: {...options.headers, ...authHeader}};
        }

        try{
            setLoading(true);
            const response = await fetch(url, newOptions);
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
        data, error, loading,
        message, statusCode
    }


}