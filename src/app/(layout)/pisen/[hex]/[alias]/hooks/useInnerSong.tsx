'use client'
import {
	mapExtendedVariantPackApiToDto,
	mapGetVariantDataApiToSongDto,
	SongDto,
} from '@/api/dtos'
import { getVariantByAlias } from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { useApiStateEffect } from '@/tech/ApiState'
import { ExtendedVariantPack } from '@/types/song'
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

export function useInnerVariant() {
	const s = useInnerSong()
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

export const InnerSongProvider = (props: ProviderProps) => {
	const p = useProvideInnerSong(props.variantAlias, props.startData)

	return p.song && p.variant ? (
		<songContext.Provider value={p}>{props.children}</songContext.Provider>
	) : (
		<p>Načítání</p>
	)
}

const useProvideInnerSong = (variantAlias: string, startData?: InData) => {
	const [apiState] = useApiStateEffect(async () => {
		if (startData) return null
		const v = await getVariantByAlias(variantAlias)
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
