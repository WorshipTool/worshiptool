export const codes = {
    "Success": 0,
    "Not Found": 404,
    "Unauthorized": 401,
    "Invalid Error": 400
}

export const messages = {
    "Success": "Success",
    "Not Found":"Not Found",
    "Unauthorized":"Unauthorized",
    "Invalid Error":"Invalid Error"
};

export interface RequestResult<T>{
    statusCode: number,
    message: string,
    data: T
}