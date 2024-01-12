import {useEffect, useState} from "react";
import {ApiState, createApiState} from "./ApiState";
import { ApiError } from "./ApiError";
import { handleApiCall } from '../handleApiCall';

interface UseApiState<T> {
    apiState: ApiState<T>,
    fetchApiState: (fetchPromise: () => Promise<T>, callback?: (data: T) => void) => void,
    invalidateApiState: () => void

}
interface UseApiStateProps<T> {
    getter?: () => ApiState<T>
    setter?: (state: ApiState<T>) => void
}

export const useApiState = <T>(props? : UseApiStateProps<T>) : UseApiState<T> => {
    const [apiState, setApiState] = useState<ApiState<T>>(createApiState<T>());

    const setState = (state: ApiState<T>) => {
        props?.setter ? props.setter(state) : setApiState(state);
    }

    const getState = () : ApiState<T> => {
        return props?.getter ? props.getter() : apiState;
    }

    const dispatchInvalidate = () => {
        setState(createApiState<T>());
    }


    const dispatchLoadingAction = () => {
        setState({
            ...getState(),
            data: null,
            loading:true,
            success:false,
            error:null,
            isDispatched: true
        });
    }

    const fetchApiState = (fetchPromise: () => Promise<T>, callback?: (data: T) => void) => {
        (async() => {
            dispatchLoadingAction();
            try {
                const data : T = await fetchPromise();
                dispatchSuccessAction(data);
                if(callback)
                    callback(data);
            } catch(err) {
                // console.log("error action", err);
                dispatchErrorAction(err as ApiError | string);
            }
        })()



    }

    const dispatchSuccessAction = (data: T) => {
        setState({
            ...getState(),
            success:true,
            data: data,
            loading: false,
            error:null,
            isDispatched: true
        });
    }

    const dispatchErrorAction = (error: ApiError | string) => {
        setState({
            ...getState(),
            error: {
                status: (typeof error === 'object' ? error.errorCode : 500) || 500,
                message: (typeof error === 'object' ? error.message : error) || error as string
            },
            loading:false,
            success:false,
            data: null,
            isDispatched: true
        });

    }


    return {
        apiState : getState(),
        fetchApiState,
        invalidateApiState: dispatchInvalidate
    };
}