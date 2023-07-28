import { BACKEND_URL } from "../apis/constants";

export const fetchData = (params: FetchParams) => {
    const paramsAddition = params.params ? Object.keys(params.params).map(key => key + '=' + params.params[key]).join('&') : undefined;
    let url = params.url;
    if(paramsAddition) url += "?" + paramsAddition;

    // Find if url is relative
    const isRelative = params.url.startsWith("/");
    if(isRelative){
        url = BACKEND_URL + url;
    }


    const newOptions = {
        ...params.options, body: JSON.stringify(params.body)
    }
    return fetch(url, newOptions)
} 

export interface FetchParams{
    url: string;
    options?: Partial<RequestOptions>;
    body?: any,
    params?: any,
}

interface RequestOptions{
    method: string;
    headers: any;
    body: string;
}