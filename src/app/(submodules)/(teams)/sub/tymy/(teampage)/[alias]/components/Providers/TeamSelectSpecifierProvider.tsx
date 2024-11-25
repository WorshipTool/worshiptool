'use client'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { useTeamSelection } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useTeamSelection'
import { SongSelectSpecifierProvider } from '@/common/components/SongSelectPopup/hooks/useSongSelectSpecifier'
import React, { useCallback } from 'react'

type TeamSelectSpecifierProviderProps = {
	children: React.ReactNode
}

export default function TeamSelectSpecifierProvider(
	props: TeamSelectSpecifierProviderProps
) {
	const team = useInnerTeam()
	const selection = useTeamSelection(team.selection.guid, team.guid)
	const getData = useCallback(
		async (searchString: string) => {
			if (searchString.length > 0)
				return selection.searchedItems.map((i) => i.variant)
			return selection.items.map((i) => i.variant)
		},
		[selection.items, selection.searchedItems, selection]
	)

	const onSearch = useCallback(
		async (searchString: string) => {
			if (searchString.length > 0) selection.search(searchString)
		},
		[selection]
	)

	return (
		<SongSelectSpecifierProvider
			customSourceList={[{ label: 'Z týmového zpěvníku', getData, onSearch }]}
		>
			{props.children}
		</SongSelectSpecifierProvider>
	)
}
