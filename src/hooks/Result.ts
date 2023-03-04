export type Result = {message:string, success: boolean, data: any};
let lastResultStatus : Result = {
    message: "Unitialized",
    success: false,
    data: undefined
};
export const result = <T extends string, P>(message: T, data?: P): P => {
    lastResultStatus = {
        message:message,
        success: data!==undefined,
        data
    }
    return data?data:(undefined as P);
};


export const isSuccess = (a?:any) => {
    console.log(a);
    if(a){
        if( typeof a.message == "string" &&
            typeof a.success == "boolean"){
                return a.success;
        }
    }
    return getResultStatus().success;
}
export const isError = (a?:any) => {
    return !isSuccess();
}

export const getResultStatus = () : Result => {
    return lastResultStatus;
}
  
