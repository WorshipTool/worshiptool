import { getPayloadObjectFromApiString } from '@/hooks/payloads/tech'
import { useApiState, useApiStateEffect } from '@/tech/ApiState'
import { useEffect, useState } from 'react'

export const usePayload = <T extends object>(
	getFunc: () => Promise<string>,
	setFunc?: (payload: string) => Promise<any>,
	defaultValues?: T
) => {
	const [_value, setValue] = useState<T>({} as T)

	const { fetchApiState, apiState: setApiState } = useApiState()
	const [getApiState, reload] = useApiStateEffect<string>(getFunc, [getFunc])

	const setter = (payload: T) => {
		if (!setFunc) {
			throw new Error('Cannot set payload - "setFunc" is not defined')
		}

		const newData = getUpdatedPayload(_value, payload)

		const str = JSON.stringify(newData)

		fetchApiState(() => setFunc(str), reload)
	}

	useEffect(() => {
		if (getApiState.data === null) return

		if (getApiState.data === '') {
			setValue(defaultValues || ({} as T))
			return
		}

		const parsed: T = getPayloadObjectFromApiString<T>(
			getApiState.data,
			defaultValues
		)

		setValue(parsed)
	}, [getApiState.data])

	const loading = getApiState.loading || setApiState.loading

	return [_value, setter, loading] as const
}

const getUpdatedPayload = <T extends object>(
	oldPayload: T,
	newPayload: Partial<T>
) => {
	return {
		...oldPayload,
		...newPayload,
	}
}
