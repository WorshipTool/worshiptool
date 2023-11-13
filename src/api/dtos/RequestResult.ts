export const codes = {
    "Success": 0,
    "Not Found": 404,
    "Unauthorized": 401,
    "Unknown Error": 400
}

export const messages = {
    "Success": "Success",
    "Not Found":"Not Found",
    "Unauthorized":"Unauthorized",
    "Unknown Error":"Unknown Error"
};

export interface RequestResult<T>{
    statusCode: number,
    message: string,
    data: T
}

export const RequestError : RequestResult<undefined> = formatted(undefined, codes["Unknown Error"]);

export const isRequestSuccess = (req: RequestResult<any>) => {
    return req.statusCode==codes["Success"];
}
export const isRequestError = (req: RequestResult<any>) => {
    return !isRequestSuccess(req);
}


export function formatted<T>(data:T, statusCode?:number, message?:string) : RequestResult<any>{
    return {
        statusCode: (statusCode===undefined?0:statusCode),
        message: (message===undefined?
                    (statusCode===undefined?messages.Success:
                        //@ts-ignore
                        messages[Object.keys(codes).find(key => codes[key] === statusCode)]):message),
        data
    }
}