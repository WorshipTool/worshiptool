import { useState } from "react";
import useAuth from "./auth/useAuth";

export default function useFetch(){
    const [data, setData] = useState<any>();
    const [error, setError] = useState<any>();
    const [loading, setLoading] = useState(true);

    const {user, getAuthHeader} = useAuth();

    const fetchData = ({url, options}:{url:string, options?:any}, after?: (d:any, e?:any)=>void) => {
        const authHeader = {...getAuthHeader()};
        let newOptions = {headers: authHeader};
        if(options){
            newOptions = {...options, headers: {...options.headers, ...authHeader}};
        }

        setLoading(true);
        fetch(url, newOptions)
        .then(response => response.json())
        .then((usefulData) => {
            if(usefulData.message&&usefulData.message=="Unauthorized"){
                setError(usefulData);
                setLoading(false);
                if(after)after(undefined,usefulData);
            }else{
                setData(usefulData);
                setLoading(false);
                if(after)after(usefulData);
            }
            
        })
        .catch((e) => {
            setLoading(false);
            setError(e);
            if(after)after(undefined,e);
        });

    }


    const post = ({url, body}: {url:string, body: any}, after?: (d:any, e?:any)=>void) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };


        fetchData({url, options: requestOptions}, after)
    }

    return {
        fetchData, post,
        data, error, loading
    }


}