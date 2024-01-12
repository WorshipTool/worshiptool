
type ApiRequestType = 'post' | 'get' | 'upload' | 'delete';

export interface ApiError {
    errorCode?: number,
    message?: string,
    requestType?: ApiRequestType
}