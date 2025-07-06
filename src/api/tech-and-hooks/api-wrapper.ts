import { handleApiCall, HandleApiCallOptions } from '@/tech/fetch/handleApiCall'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'
import { AxiosResponse } from 'axios'

type AnyFn = (...args: any[]) => any

type MappingEntry<F extends AnyFn> = F extends (
	...args: any[]
) => Promise<AxiosResponse<infer R>>
	? { map?: (data: R) => any } & HandleApiCallOptions
	: {}

type Mapping<T extends Record<string, AnyFn>> = {
	[K in keyof T]?: MappingEntry<T[K]>
}

export type ApiWrappedWithMapping<
	T extends Record<string, any>,
	M extends Mapping<T>
> = {
	[K in keyof T]: (
		...args: Parameters<T[K]>
	) => Promise<
		M[K] extends { map: (...args: any[]) => infer R }
			? R
			: T[K] extends (...args: any[]) => Promise<AxiosResponse<infer D>>
			? D
			: never
	>
}

const baseWrap = <T extends Record<string, AnyFn>, M extends Mapping<T>>(
	api: T,
	methodOptions: M,
	handler: <U>(
		p: Promise<AxiosResponse<U>>,
		options: HandleApiCallOptions
	) => Promise<U>
): ApiWrappedWithMapping<T, M> => {
	const wrapped: Partial<ApiWrappedWithMapping<T, M>> = {}

	const proto = Object.getPrototypeOf(api)
	const methodNames = Object.getOwnPropertyNames(proto).filter(
		(key) => typeof (api as any)[key] === 'function' && key !== 'constructor'
	) as (keyof T)[]

	for (const key of methodNames) {
		const fn = api[key]
		wrapped[key] = ((...args: any[]) => {
			const promise = fn.apply(api, args)
			const options = methodOptions?.[key]

			const call = handler(promise, options ?? {})
			const mapFn = options?.map
			return mapFn ? call.then(mapFn) : call
		}) as ApiWrappedWithMapping<T, M>[typeof key]
	}

	return wrapped as ApiWrappedWithMapping<T, M>
}

export function wrapApi<T extends Record<string, any>>(
	api: T
): ApiWrappedWithMapping<T, {}>
export function wrapApi<T extends Record<string, any>, M extends Mapping<T>>(
	api: T,
	mapping: M
): ApiWrappedWithMapping<T, M>
export function wrapApi<T extends Record<string, any>, M extends Mapping<T>>(
	api: T,
	mapping?: M
): ApiWrappedWithMapping<T, M> {
	return baseWrap(
		api,
		(mapping ?? {}) as Mapping<T>,
		handleApiCall
	) as ApiWrappedWithMapping<T, M>
}
export const wrapServerApi = <
	T extends Record<string, any>,
	M extends Mapping<T>
>(
	api: T,
	mapping: M = {} as M
) => baseWrap(api, mapping, handleServerApiCall)
