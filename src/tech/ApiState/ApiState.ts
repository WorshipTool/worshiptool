export interface ApiState<T = void> {
    data: T | null,
    loading: boolean,
    success : boolean,
    error: ApiStateError | null,
    isDispatched: boolean
}

export interface ApiStateError {
    status: number;
    message: string;

}

export const emptyApiState: Readonly<ApiState<never>> = {
    data: null,
    error: null,
    loading: false,
    success: false,
    isDispatched: false
}

export const createApiState= <T> (state?: Partial<ApiState<T>>) : ApiState<T> => {
    return {...emptyApiState, ...state};

}

export const isApiStateDispatched = <T>(apiState: ApiState<T>): boolean => apiState.isDispatched;
