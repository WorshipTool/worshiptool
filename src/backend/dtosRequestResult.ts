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

export const RequestError : RequestResult<undefined> = {
    statusCode: codes["Unknown Error"],
    message: messages["Unknown Error"],
    data: undefined
}

export const isSuccess = (req: RequestResult<any>) => {
    return req.statusCode==codes["Success"];
}