import { useState } from "react";

export default function useFetch(){
    const [data, setData] = useState<any>();
    const [error, setError] = useState<any>();
    const [loading, setLoading] = useState(true);

    const fetchData = (url:string) => {
        setLoading(true);
        fetch(url)
        .then(response => response.json())
        .then((usefulData) => {
            setData(usefulData);
            setLoading(false);
        })
        .catch((e) => {
            setError(e);
        });

    }

    return {
        fetchData,
        data, error, loading
    }


}