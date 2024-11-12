'use client'

import { InnerPlaylistProvider } from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import TeamSelectSpecifierProvider from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/Providers/TeamSelectSpecifierProvider'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useSmartParams } from '@/routes/useSmartParams'
import { ReactNode } from 'react'

type TeamPlaylistClientProvidersProps = {
	children: ReactNode
}

export default function TeamPlaylistClientProviders(
	props: TeamPlaylistClientProvidersProps
) {
	const { guid } = useSmartParams('teamPlaylist')
	return (
		<TeamSelectSpecifierProvider>
			{!guid ? null : (
				<InnerPlaylistProvider guid={guid as PlaylistGuid}>
					{props.children}
				</InnerPlaylistProvider>
			)}
		</TeamSelectSpecifierProvider>
	)
}
