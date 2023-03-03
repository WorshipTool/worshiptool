export interface Result<T>{
    message: T,
    data? :any
}

export const result = <T> (message: T, data?:any) : Result<T> => {
    return {
        message,
        data
    }
}

export const isResult = <T> (r: Result<T>, sameAs: T) : boolean => {
    return r.message===sameAs;
}

