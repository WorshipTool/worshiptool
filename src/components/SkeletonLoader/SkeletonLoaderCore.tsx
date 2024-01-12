import React, {ReactNode} from "react";
import {Link} from "react-router-dom";
import { ApiState } from "../../tech/ApiState";

type ApiStateArray<T extends unknown[]> = {[P in keyof T] : ApiState<T[P]>}

interface SkeletonLoaderProps<T extends unknown[]> {
    data: ApiStateArray<T>,
    render?: (data: T) => ReactNode,
    renderLoading?: () => ReactNode,
    renderError?: () => ReactNode
}

const ApiStateStatus = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    LOADING: 'LOADING',
    INVALIDATED: 'NONE'
}

const getApiStateStatus = (apiStates: ApiState[]) => {

    if(apiStates.some(apiState => apiState.loading))
        return ApiStateStatus.LOADING;
    if(apiStates.every(apiState => apiState.success))
        return ApiStateStatus.SUCCESS;
    if(apiStates.some(apiState => apiState.error))
        return ApiStateStatus.ERROR;
    return ApiStateStatus.INVALIDATED;
}

export function SkeletonLoaderCore <T extends unknown[]>({data, render, renderLoading, renderError} : SkeletonLoaderProps<T>){
    const status = getApiStateStatus(data as ApiState[]);



    return <>
        {status === ApiStateStatus.SUCCESS && render?.(data.map(state => state.data) as T)}
        {status === ApiStateStatus.ERROR && (renderError ? renderError() : (
            <div className='text-center pt-5'>
                <h3 className="fw-bold">Litujeme, vyskytla se chyba.</h3>
                <div>Je možné, že aktivní obec nemá k této stránce přístup.</div>

                <Link to={"/"} className="btn btn-primary fw-bold mt-4">
                    Přejít zpět na hlavní stránku
                </Link>
            </div>
        ))}
        {status === ApiStateStatus.LOADING && (renderLoading?.() ?? <div className='text-center'>...</div>)}
        {status === ApiStateStatus.INVALIDATED && <div></div>}
    </>
}