import { useState } from "react";

export default function useFetch(){
    const [data, setData] = useState<any>();
    const [error, setError] = useState<any>();
    const [loading, setLoading] = useState(true);

    const fetchData = ({url, options}:{url:string, options?:any}, after?: (d:any, e?:any)=>void) => {
        setLoading(true);
        fetch(url, options)
        .then(response => response.json())
        .then((usefulData) => {
            setData(usefulData);
            setLoading(false);

            if(after)after(usefulData);
        })
        .catch((e) => {
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