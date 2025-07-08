import {
	CreateTeamEventInDto,
	EditTeamEventInDto,
	TeamEvent,
} from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { useApiState, useApiStateEffect } from '@/tech/ApiState'

export function useTeamEvents(guid: string) {
	const { teamEventsApi } = useApi()

	const [apiState, reload] = useApiStateEffect(async () => {
		const data = await teamEventsApi.getEvents(guid)
		return data
	}, [guid])

	const { fetchApiState, apiState: createApiState } = useApiState<TeamEvent>()
	const addEvent = async (data: CreateTeamEventInDto) => {
		const result = await fetchApiState(async () => {
			return teamEventsApi.createEvent(data)
		})

		if (result) {
			reload()
			return true
		}

		return false
	}

	const editEvent = async (data: EditTeamEventInDto) => {
		const result = await fetchApiState(async () => {
			return teamEventsApi.editEvent(data)
		})

		if (result) {
			reload()
			return true
		}

		return false
	}

	const deleteEvent = async (guid: string) => {
		const result = await fetchApiState(async () => {
			return teamEventsApi.deleteEvent(guid)
		})

		if (result) {
			reload()
			return true
		}

		return false
	}

	return {
		apiState,
		events: apiState.data?.events || [],
		createApiState,
		addEvent,
		editEvent,
		deleteEvent,
	}
}
