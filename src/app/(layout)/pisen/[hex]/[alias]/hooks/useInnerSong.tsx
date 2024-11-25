'use client'
import {
	mapGetSongDataApiToSongDto,
	mapSongDataVariantApiToSongVariantDto,
} from '@/api/dtos'
import { SongGettingApi } from '@/api/generated'
import { getVariantByAlias } from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { useApiStateEffect } from '@/tech/ApiState'
import { handleApiCall } from '@/tech/handleApiCall'
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

type ProviderProps = {
	children: any
	variantAlias: string
}

export const InnerSongProvider = (props: ProviderProps) => {
	const p = useProvideInnerSong(props.variantAlias)

	return (
		p.song &&
		p.variant && (
			<songContext.Provider value={p}>{props.children}</songContext.Provider>
		)
	)
}

const useProvideInnerSong = (variantAlias: string) => {
	const [apiState] = useApiStateEffect(async () => {
		const v = await getVariantByAlias(variantAlias)
		const variant = v.variants[0]

		const songGettingApi = new SongGettingApi()

		const data = await handleApiCall(
			songGettingApi.songGettingControllerGetSongDataByVariantGuid(variant.guid)
		)

		const song = mapGetSongDataApiToSongDto(data)
		const variantData = mapSongDataVariantApiToSongVariantDto(variant)

		return { song, variant: variantData }
	}, [variantAlias])

	return {
		loading: apiState.loading,
		song: apiState.data?.song!,
		variant: apiState.data?.variant!,
	}
}
