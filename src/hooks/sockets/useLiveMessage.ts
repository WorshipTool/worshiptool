import { BACKEND_URL } from '@/api/constants'
import { useCallback, useEffect } from 'react'
import io from 'socket.io-client'

const DISABLE_WEBSOCKET = process.env.NEXT_PUBLIC_DISABLE_WEBSOCKETS === 'true'

// get return type of io

const socket: ReturnType<typeof io> = DISABLE_WEBSOCKET
	? (null as any)
	: io(BACKEND_URL, {
			transports: ['websocket'],
	  })

type Socket<T extends string> = {
	eventName: T
	data: any
}

type Listeners<T extends string> = {
	[K in T]: (data: any) => void
}

const START_LISTEN_GROUP_EVENT_NAME = 'start-listen-group'
const STOP_LISTEN_GROUP_EVENT_NAME = 'stop-listen-group'

export const useLiveMessage = <T extends string, Events extends Listeners<T>>(
	groupName: string,
	listeners?: Events
) => {
	const localEventName = groupName

	const sendInitalMessage = useCallback(() => {
		if (DISABLE_WEBSOCKET) return
		socket.emit(START_LISTEN_GROUP_EVENT_NAME, localEventName)
	}, [localEventName])

	const stopListening = useCallback(() => {
		if (DISABLE_WEBSOCKET) return
		socket.emit(STOP_LISTEN_GROUP_EVENT_NAME, localEventName)
	}, [localEventName])

	useEffect(() => {
		sendInitalMessage()
		return () => {
			stopListening()
		}
	}, [localEventName])

	const handle = useCallback(
		(data: Socket<T>) => {
			const listener = listeners?.[data.eventName]
			if (listener) {
				listener(data.data)
			}
		},
		[listeners]
	)

	useEffect(() => {
		if (DISABLE_WEBSOCKET) return
		socket.on(localEventName, handle)
		return () => {
			socket.off(localEventName)
		}
	}, [localEventName, handle])

	const send = <K extends T>(eventName: K, data: Parameters<Events[K]>[0]) => {
		if (DISABLE_WEBSOCKET) return

		const socketData: Socket<T> = {
			eventName,
			data,
		}
		socket.emit(localEventName, socketData)

		// Receive self message
		handle(socketData)
	}
	return {
		send,
	}
}
