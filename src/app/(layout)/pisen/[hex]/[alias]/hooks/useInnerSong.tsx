'use client'
import {
	mapExtendedVariantPackApiToDto,
	mapGetVariantDataApiToSongDto,
} from '@/api/dtos'
import { getVariantByAlias } from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { useApiStateEffect } from '@/tech/ApiState'
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
		const variant = v.main

		const song = mapGetVariantDataApiToSongDto(v)
		const variantData = mapExtendedVariantPackApiToDto(variant)

		return { song, variant: variantData }
	}, [variantAlias])

	return {
		loading: apiState.loading,
		song: apiState.data?.song!,
		variant: apiState.data?.variant!,
	}
}
