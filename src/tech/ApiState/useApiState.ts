'use client'
import { useState } from 'react'
import { ApiError } from './ApiError'
import { ApiState, createApiState } from './ApiState'

interface UseApiState<T> {
	apiState: ApiState<T>
	fetchApiState: (
		fetchPromise: () => Promise<T>,
		callback?: (data: T) => void
	) => Promise<T | null>
	invalidateApiState: () => void
}
interface UseApiStateProps<T> {
	getter?: () => ApiState<T>
	setter?: (state: ApiState<T>) => void
}

export const useApiState = <T>(props?: UseApiStateProps<T>): UseApiState<T> => {
	const [apiState, setApiState] = useState<ApiState<T>>(createApiState<T>())

	const setState = (state: ApiState<T>) => {
		props?.setter ? props.setter(state) : setApiState(state)
	}

	const getState = (): ApiState<T> => {
		return props?.getter ? props.getter() : apiState
	}

	const dispatchInvalidate = () => {
		setState(createApiState<T>())
	}

	const dispatchLoadingAction = () => {
		setState({
			...getState(),
			data: null,
			loading: true,
			success: false,
			error: null,
			isDispatched: true,
		})
	}

	const fetchApiState = async (
		fetchPromise: () => Promise<T>,
		callback?: (data: T) => void
	) => {
		dispatchLoadingAction()
		try {
			const data: T = await fetchPromise()
			dispatchSuccessAction(data)
			if (callback) callback(data)

			return data
		} catch (err) {
			console.log(err)

			dispatchErrorAction(err as ApiError | string)

			return null
		}
	}

	const dispatchSuccessAction = (data: T) => {
		setState({
			...getState(),
			success: true,
			data: data,
			loading: false,
			error: null,
			isDispatched: true,
		})
	}

	const dispatchErrorAction = (error: ApiError | string | any) => {
		try {
			console.log('error', error)
			setState({
				...getState(),
				error: {
					status:
						(typeof error === 'object'
							? error.errorCode || error.request.status
							: 500) || 500,
					message:
						(typeof error === 'object' ? error.message : error) ||
						(error as string),
				},
				loading: false,
				success: false,
				data: null,
				isDispatched: true,
			})
		} catch (e) {
			console.error('Error while dispatching error action:', e)
		}
	}

	return {
		apiState: getState(),
		fetchApiState,
		invalidateApiState: dispatchInvalidate,
	}
}
