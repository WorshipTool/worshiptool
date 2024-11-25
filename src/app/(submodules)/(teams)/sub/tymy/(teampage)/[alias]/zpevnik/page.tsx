'use client'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/components/TeamPageTitle'

import { SongVariantDto } from '@/api/dtos'
import FloatingPlaylist from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/FloatingPlaylist/FloatingPlaylist'
import { SmartTeamPage } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/SmartTeamPage/SmartTeamPage'
import { TeamSongList } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/zpevnik/components/TeamSongList'
import { RoutesKeys, SmartParams } from '@/routes'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useSmartParams } from '@/routes/useSmartParams'
import { useCallback } from 'react'
import './styles.css'

export default SmartTeamPage(TeamSongsPage)

function TeamSongsPage() {
	const { alias } = useSmartParams('teamSongbook')

	const cardToProps = useCallback((variant: SongVariantDto) => {
		const p = parseVariantAlias(variant.packAlias)

		const to: RoutesKeys = 'teamSong'
		const params: SmartParams<'teamSong'> = {
			hex: p.hex,
			'title-alias': p.alias,
			alias,
		}
		return {
			to,
			params,
		}
	}, [])
	return (
		<>
			<TeamPageTitle>Seznam písní</TeamPageTitle>
			<TeamSongList cardToProps={cardToProps} />

			<FloatingPlaylist />
		</>
	)
}
