'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { apiToGroupPayload } from '../../api/dtos/group'
import { GroupApi } from '../../api/generated'
import { Group, GroupPayloadType } from '../../interfaces/group/Group'

import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useSmartNavigate } from '../../routes/useSmartNavigate'
import { handleApiCall } from '../../tech/handleApiCall'
import useAuth from '../auth/useAuth'

export const groupContext = createContext<useProvideGroupI>(
	{} as useProvideGroupI
)

export default function useGroup() {
	return useContext(groupContext)
}

export const GroupProvider = ({ children }: { children: any }) => {
	const auth = useProvideGroup()

	return <groupContext.Provider value={auth}>{children}</groupContext.Provider>
}

interface useProvideGroupI {
	code: string
	name: string
	guid: string
	selectionGuid: PlaylistGuid
	payload: GroupPayloadType
	setPayload: (payload: GroupPayloadType) => Promise<void>
	turnOn: (code: string) => void
	turnOff: () => void
	isOn: boolean
}

export const useProvideGroup = (): useProvideGroupI => {
	// const {fetchData} = useFetch();

	const navigate = useSmartNavigate()

	const [group, setGroup] = useState<Group>()

	const { isLoggedIn, apiConfiguration } = useAuth()
	const groupApi = new GroupApi(apiConfiguration)

	const key = 'activeGroup'

	const turnOn = (code: string) => {
		handleApiCall(groupApi.groupControllerGetGroupInfo(undefined, code))
			.then((r) => {
				setGroup({
					...r,
					payload: apiToGroupPayload(r.payload),
					selection: r.selection as PlaylistGuid,
				})
				localStorage.setItem(key, code)
			})
			.catch((e) => {
				console.log(e)
			})
	}
	const turnOff = () => {
		setGroup(undefined)
		localStorage.removeItem(key)

		// TODO: implements better
		if (window?.location.pathname.includes('skupina')) {
			navigate('home', {
				search: undefined,
			})
		}
	}

	const setPayload = async (payload: GroupPayloadType) => {
		if (!group) return
		return await handleApiCall(
			groupApi.groupControllerUpdateGroupPayload({
				guid: group.guid,
				payload: JSON.stringify(payload),
			})
		)
	}

	useEffect(() => {
		if (!isLoggedIn()) return
		const activeName = localStorage.getItem(key)
		if (!activeName) return
		turnOn(activeName)
	}, [isLoggedIn()])

	return {
		turnOn,
		turnOff,
		isOn: group !== undefined,
		code: group?.code || '',
		name: group?.name || '',
		guid: group?.guid || '',
		payload: group?.payload || {},
		setPayload,
		selectionGuid: (group?.selection || '') as PlaylistGuid,
	}
}
