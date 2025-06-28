import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'
import { handleApiCall } from '@/tech/handleApiCall'
import { AxiosResponse } from 'axios'

type AnyFn = (...args: any[]) => any

// Typ mappingu, který umožňuje přístup ke správnému typu z AxiosResponse
type Mapping<T extends Record<string, AnyFn>> = Partial<{
	[K in keyof T]: T[K] extends (
		...args: any[]
	) => Promise<AxiosResponse<infer R>>
		? (data: R) => any
		: never
}>

// Hlavní typ wrapperu s mappingem nebo bez něj
export type ApiWrappedWithMapping<
	T extends Record<string, any>,
	M extends Mapping<T>
> = {
	[K in keyof T]: (
		...args: Parameters<T[K]>
	) => Promise<
		K extends keyof M
			? ReturnType<NonNullable<M[K]>>
			: T[K] extends (...args: any[]) => Promise<AxiosResponse<infer R>>
			? R
			: never
	>
}

const baseWrap = <T extends Record<string, AnyFn>, M extends Mapping<T>>(
	api: T,
	mapping: M,
	handler: <U>(p: Promise<AxiosResponse<U>>) => Promise<U>
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
			const call = handler(promise)
			const mapFn = mapping?.[key]
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
