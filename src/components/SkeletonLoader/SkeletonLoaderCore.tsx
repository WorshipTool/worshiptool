import React, { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import { ApiState } from "../../tech/ApiState";
import { useSnackbar } from "notistack";
import { isDevelopment } from "../../tech/development.tech";
import { Button } from "@mui/material";

type ApiStateArray<T extends unknown[]> = { [P in keyof T]: ApiState<T[P]> };

interface SkeletonLoaderProps<T extends unknown[]> {
    data: ApiStateArray<T>;
    render?: (data: T) => ReactNode;
    renderLoading?: () => ReactNode;
    renderError?: () => ReactNode;
}

const ApiStateStatus = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    LOADING: "LOADING",
    INVALIDATED: "NONE"
};

const getApiStateStatus = (apiStates: ApiState[]) => {
    if (apiStates.some((apiState) => apiState.loading))
        return ApiStateStatus.LOADING;
    if (apiStates.every((apiState) => apiState.success))
        return ApiStateStatus.SUCCESS;
    if (apiStates.some((apiState) => apiState.error))
        return ApiStateStatus.ERROR;
    return ApiStateStatus.INVALIDATED;
};

export function SkeletonLoaderCore<T extends unknown[]>({
    data,
    render,
    renderLoading,
    renderError
}: SkeletonLoaderProps<T>) {
    const status = getApiStateStatus(data as ApiState[]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        if (!isDevelopment) return;

        if (status === ApiStateStatus.ERROR) {
            enqueueSnackbar(
                <div>
                    Nastala chyba při načítání dat.{" "}
                    <b>Implementuj renderError</b>
                </div>,
                {
                    variant: "error",
                    persist: true,
                    action: (
                        <Button variant="contained" color="error">
                            Zavřít
                        </Button>
                    ),
                    onClick: () => closeSnackbar()
                }
            );
        }
    }, [status]);

    return (
        <>
            {status === ApiStateStatus.SUCCESS &&
                render?.(data.map((state) => state.data) as T)}
            {status === ApiStateStatus.ERROR &&
                (renderError ? renderError() : <>{JSON.stringify(data)}</>)}
            {status === ApiStateStatus.LOADING &&
                (renderLoading?.() ?? <div className="text-center">...</div>)}
            {status === ApiStateStatus.INVALIDATED && <div></div>}
        </>
    );
}
