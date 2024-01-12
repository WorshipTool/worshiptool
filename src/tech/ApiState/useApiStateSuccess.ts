import {useEffect, useRef} from "react";
import {ApiState} from "./ApiState";


export const useApiStateSuccess = (callback: () => void, deps: ApiState<unknown>[]) => {

    const previousIsAnyLoading = useRef(false);

    useEffect(() => {
        if(previousIsAnyLoading.current){
            if(deps.every(apiState => apiState.success)){
                callback();
            }
        }

        previousIsAnyLoading.current = deps.some(apiState => apiState.loading);
    },deps)
}