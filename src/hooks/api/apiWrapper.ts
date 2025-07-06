import { handleApiCall } from '@/tech/handleApiCall'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'

export type Mapping = Record<string, (data: any) => any>

const baseWrap = <T extends Record<string, any>>(api: T, mapping: Mapping = {}, handler: (p: Promise<any>) => Promise<any>) => {
    const wrapped: Record<string, any> = {}
    for (const key of Object.keys(api)) {
        const fn = (api as any)[key]
        if (typeof fn === 'function') {
            wrapped[key] = (...args: any[]) => {
                const promise = fn.apply(api, args)
                const call = handler(promise as any)
                const mapFn = mapping[key]
                return mapFn ? call.then(mapFn) : call
            }
        }
    }
    return wrapped as T
}

export const wrapApi = <T extends Record<string, any>>(api: T, mapping: Mapping = {}) =>
    baseWrap(api, mapping, handleApiCall)

export const wrapServerApi = <T extends Record<string, any>>(api: T, mapping: Mapping = {}) =>
    baseWrap(api, mapping, handleServerApiCall)
