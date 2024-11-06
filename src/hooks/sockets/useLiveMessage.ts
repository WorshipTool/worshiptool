import { BACKEND_URL } from '@/api/constants'
import { useEffect } from 'react'
import io from 'socket.io-client'

const socket = io(BACKEND_URL, {
	transports: ['websocket'],
})

type Socket<T extends string> = {
	eventName: T
	data: any
}

type Listeners<T extends string> = {
	[K in T]: (data: any) => void
}

export const useLiveMessage = <T extends string, Events extends Listeners<T>>(
	groupName: string,
	listeners?: Events
) => {
	const localEventName = groupName

	useEffect(() => {
		const handle = (data: Socket<T>) => {
			const listener = listeners?.[data.eventName]
			if (listener) {
				listener(data.data)
			}
		}

		socket.on(localEventName, handle)
		return () => {
			socket.off(localEventName)
		}
	}, [localEventName, listeners])

	const send = <K extends T>(eventName: K, data: Parameters<Events[K]>[0]) => {
		const socketData: Socket<T> = {
			eventName,
			data,
		}
		socket.emit(localEventName, socketData)
	}
	return {
		send,
	}
}
