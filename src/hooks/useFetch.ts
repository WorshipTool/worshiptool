import { useState } from "react";
import useAuth from "./auth/useAuth";
import { RequestResult, codes, messages } from "../backend/dtosRequestResult";



export default function useFetch(){
    const [data, setData] = useState<any>();
    const [error, setError] = useState<any>();
    const [message, setMessage] = useState<string>("");
    const [statusCode, setStatusCode] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const {user, getAuthHeader} = useAuth();

    const fetchData = ({url, options}:{url:string, options?:any}, after?: (d:RequestResult<any>|undefined, e?:any)=>void) => {
        const authHeader = {...getAuthHeader()};
        let newOptions = {headers: authHeader};
        if(options){
            newOptions = {...options, headers: {...options.headers, ...authHeader}};
        }

        setLoading(true);
        fetch(url, newOptions)
        .then(response => response.json())
        .then((data : RequestResult<any>) => {
            if(data.statusCode===undefined){
                //Backend returned nothing, or invalid format
                setError(data);
                setMessage(messages["Invalid Error"]);
                setStatusCode(codes["Invalid Error"]);
                if(after)after(undefined,data);


            }else if(data.statusCode&&data.statusCode>=400){
                //Backend returned an error.
                setError(data.message);
                setMessage(data.message);
                setStatusCode(data.statusCode);
                setLoading(false);
                if(after)after(undefined,data.message);

            }else{
                //successful fetch
                setData(data.data);
                setMessage(data.message);
                setStatusCode(data.statusCode);
                setError(null);
                setLoading(false);
                if(after)after(data);
            }
            
        })
        .catch((e) => {
            setLoading(false);
            setError(e);
            setData(null);
            setStatusCode(codes["Invalid Error"]);
            setMessage(messages["Invalid Error"]);

            if(after)after(undefined,e);
        });

    }


    const post = ({url, body}: {url:string, body: any}, after?: (d:RequestResult<any>|undefined, e?:any)=>void) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };


        fetchData({url, options: requestOptions}, after)
    }

    return {
        fetchData, post,
        data, error, loading,
        message, statusCode
    }


}