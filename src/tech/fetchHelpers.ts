import { BACKEND_URL } from "../api/constants";

export const fetchData = (params: FetchParams, stringifyBody = true) => {
    const paramsAddition = params.params ? Object.keys(params.params).map(key => key + '=' + params.params[key]).join('&') : undefined;
    let url = params.url;
    if(paramsAddition) url += "?" + paramsAddition;

    // Find if url is relative
    const isRelative = params.url.startsWith("/");
    if(isRelative){
        url = BACKEND_URL + url;
    }


    const newOptions = {
        ...params.options, body: stringifyBody ? JSON.stringify(params.body) : params.body
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
    body: string | FormData;
}