'use client'
import { mapSongDataVariantApiToSongVariantDto } from '@/api/dtos'
import {
	getVariantAliasFromParams,
	getVariantByAlias,
} from '@/app/(layout)/pisen/[hex]/[alias]/tech'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import SongPreview from '@/app/(subdomains)/sub/tymy/[alias]/pisen/[hex]/[title-alias]/components/SongPreview'
import { SmartParams } from '@/routes'
import { useApiStateEffect } from '@/tech/ApiState'
import { Description } from '@mui/icons-material'
import { Box } from '@mui/material'
import { Sheet } from '@pepavlin/sheet-api'
import { useState } from 'react'

type TeamPisenPageProps = {
	params: SmartParams<'teamSong'>
}

export default function TeamPisenPage(props: TeamPisenPageProps) {
	// const {} = useSmartParams
	const [sheet, setSheet] = useState<Sheet | null>(null)

	const [justNumber, setJustNumber] = useState(0)
	const rerender = () => {
		setJustNumber(justNumber + 1)
	}

	const [apiState] = useApiStateEffect(async () => {
		const alias = getVariantAliasFromParams(
			props.params.hex,
			props.params['title-alias']
		)
		const v = await getVariantByAlias(alias)
		const variant = v.variants[0]
		const d = mapSongDataVariantApiToSongVariantDto(variant)
		setSheet(d.sheet)
		return d
	}, [props.params.hex, props.params['title-alias']])

	return (
		<Box>
			<TeamPageTitle>
				{/* <TransposePanel
					transpose={(i) => {
						sheet?.transpose(i)
						rerender()
					}}
					disabled={false}
				/> */}
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					gap={2}
				>
					<Box
						display={'flex'}
						justifyContent={'end'}
						alignItems={'center'}
						width={6 * 8}
					>
						<Description
							fontSize="inherit"
							sx={{
								fontSize: '1.8rem',
							}}
						/>
					</Box>
					{apiState.data?.preferredTitle}
				</Box>
			</TeamPageTitle>
			{apiState.data && sheet && (
				<>
					<SongPreview variant={apiState.data} sheet={sheet} />
				</>
			)}
		</Box>
	)
}
