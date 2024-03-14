import { AxiosResponse } from "axios";

export const networkErrorEvent = new CustomEvent('networkErrorEvent');
export const unauthorizedEvent = new CustomEvent('unauthorizedEvent');

// Handle function for all API calls
// parameters: request - asynchronous function that returns a promise
// Handles errors and returns the promise response
export const handleApiCall = <T>(request: Promise<AxiosResponse<T>>) => {
    return request
    .then((res)=>{
        return res.data;
    })
    .catch((err)=>{
        if(err.message == "Network Error"){
            window.dispatchEvent(networkErrorEvent) 
        }
        else if(err.response.status === 502){
            window.dispatchEvent(networkErrorEvent) 
        }
        if(err.response.status === 401){
            window.dispatchEvent(unauthorizedEvent)
        }
        throw err;
    })
}