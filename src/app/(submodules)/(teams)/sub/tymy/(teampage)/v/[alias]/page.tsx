'use client'
import { BasicVariantPack } from '@/api/dtos'
import { TeamPageTitle } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/components/TopPanel/components/TeamPageTitle'
import { TeamSongList } from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/zpevnik/components/TeamSongList'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/hooks/useInnerTeam'
import { PageProps } from '@/common/types'
import { Box, useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'
import useAuth from '@/hooks/auth/useAuth'
import { RoutesKeys, SmartParams } from '@/routes'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { useCallback, useEffect, useState } from 'react'

export default function Page(props: PageProps<'teamPublic'>) {
	const { user } = useAuth()

	const navigate = useSmartNavigate()
	const { members, name } = useInnerTeam()
	useEffect(() => {
		if (!user) return

		if (members.me?.userGuid === user.guid) {
			// navigate('team', {
			// 	alias: props.params.alias,
			// })
		}
	}, [user, members.me])

	const [open, setOpen] = useState(false)

	const theme = useTheme()

	const cardToProps = useCallback((variant: BasicVariantPack) => {
		const p = parseVariantAlias(variant.packAlias)

		const to: RoutesKeys = 'teamPublicSong'
		const params: SmartParams<'teamPublicSong'> = {
			hex: p.hex,
			'title-alias': p.alias,
			alias: props.params.alias,
		}
		return {
			to,
			params,
		}
	}, [])

	const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

	return (
		<Box>
			<TeamPageTitle>
				{!isSmall && 'Tým'} {name}
			</TeamPageTitle>

			<TeamSongList cardToProps={cardToProps} />
		</Box>
	)
}
