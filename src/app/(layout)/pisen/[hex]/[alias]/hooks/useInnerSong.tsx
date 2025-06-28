'use client'
import { mapBasicSongApiToDto } from '@/api/dtos'
import { useApi } from '@/hooks/api/useApi'
import { useApiStateEffect } from '@/tech/ApiState'
import { BasicSong, SongGuid } from '@/types/song'
import { createContext, useContext } from 'react'

type Rt = ReturnType<typeof useProvideInnerSong>

const songContext = createContext<Rt>({ uninitialized: true } as any)

export function useInnerSong() {
	const r = useContext(songContext)

	if ((r as any).uninitialized) {
		throw new Error('useInnerSong was called outside of InnerSongProvider')
	}

	return r
}

type InData = BasicSong

type ProviderProps = {
	children: any
	songGuid: SongGuid

	startData?: InData
}

export const InnerSongProvider = (props: ProviderProps) => {
	const p = useProvideInnerSong(props.songGuid, props.startData)

	return true ? (
		<songContext.Provider value={p}>{props.children}</songContext.Provider>
	) : (
		<p>Načítání</p>
	)
}

const useProvideInnerSong = (songGuid: SongGuid, startData?: InData) => {
	const { songGettingApi } = useApi()
	const [apiState] = useApiStateEffect(async () => {
		if (startData) return null
		const v = await songGettingApi.songOneGettingControllerGetSongDataByGuid(
			songGuid
		)
		const data = mapBasicSongApiToDto(v)

		return data
	}, [songGuid, startData])

	return {
		loading: apiState.loading,
		data: apiState.data || startData,
	}
}
