import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'
import { handleApiCall } from '@/tech/handleApiCall'
import { AxiosResponse } from 'axios'

type AnyFn = (...args: any[]) => any

type Mapping<T extends Record<string, AnyFn>> = Partial<{
	[K in keyof T]: (data: any) => any
}>

// typ který bere v potaz mapping:
type WrappedWithMapping<
	T extends Record<string, AnyFn>,
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
): WrappedWithMapping<T, M> => {
	const wrapped: Partial<WrappedWithMapping<T, M>> = {}

	for (const key of Object.keys(api) as (keyof T)[]) {
		const fn = api[key]
		if (typeof fn === 'function') {
			wrapped[key] = ((...args: any[]) => {
				const promise = fn.apply(api, args)
				const call = handler(promise)
				const mapFn = mapping?.[key]
				return mapFn ? call.then(mapFn) : call
			}) as WrappedWithMapping<T, M>[typeof key]
		}
	}

	return wrapped as WrappedWithMapping<T, M>
}

export const wrapApi = <T extends Record<string, any>, M extends Mapping<T>>(
	api: T,
	mapping: M = {} as M
) => baseWrap(api, mapping, handleApiCall)

export const wrapServerApi = <
	T extends Record<string, any>,
	M extends Mapping<T>
>(
	api: T,
	mapping: M = {} as M
) => baseWrap(api, mapping, handleServerApiCall)
