'use client'
import {
	mapExtendedVariantPackApiToDto,
	mapGetVariantDataApiToSongDto,
	SongDto,
} from '@/api/dtos'
import { useApi } from '@/hooks/api/useApi'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
import { ExtendedVariantPack } from '@/types/song'
import { createContext, useContext } from 'react'

type Rt = ReturnType<typeof useProvideInnerPack>

const packContext = createContext<Rt>({ uninitialized: true } as any)

export function useInnerPackSong() {
	const r = useContext(packContext)

	if ((r as any).uninitialized) {
		throw new Error('useInnerSong was called outside of InnerPackProvider')
	}

	return r
}

export function useInnerPack() {
	const s = useInnerPackSong()
	return s.variant
}

type InData = {
	song: SongDto
	variant: ExtendedVariantPack
}

type ProviderProps = {
	children: any
	variantAlias: string

	startData?: InData
}

export const InnerPackProvider = (props: ProviderProps) => {
	const p = useProvideInnerPack(props.variantAlias, props.startData)

	return p.song && p.variant ? (
		<packContext.Provider value={p}>{props.children}</packContext.Provider>
	) : (
		<p>Načítání</p>
	)
}

const useProvideInnerPack = (variantAlias: string, startData?: InData) => {
	const { songGettingApi } = useApi()
	const [apiState] = useApiStateEffect(async () => {
		if (startData) return null
		const v = await handleApiCall(
			songGettingApi.songOneGettingControllerGetVariantDataByAlias(variantAlias)
		)
		const variant = v.main

		const song = mapGetVariantDataApiToSongDto(v)
		const variantData = mapExtendedVariantPackApiToDto(variant)

		return { song, variant: variantData }
	}, [variantAlias, startData])

	return {
		loading: apiState.loading,
		song: apiState.data?.song! || startData?.song,
		variant: apiState.data?.variant! || startData?.variant,
	}
}
