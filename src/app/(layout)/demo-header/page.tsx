'use client'

import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, IconButton, Typography } from '@/common/ui'
import {
	ChevronRightRounded,
	MusicNoteRounded,
	SearchRounded,
} from '@mui/icons-material'
import { Fragment } from 'react'

export default SmartPage(DemoHeader, ['fullWidth', 'hideFooter', 'hideToolbar'])

const SONGS = [
	{ t: 'Přijď již, přijď Duchu stvořiteli', a: 'Svítání' },
	{ t: 'Hoden je Beránek', a: 'Chvály' },
	{ t: 'Tobě patří chvála', a: 'Timothy' },
	{ t: 'Kdo mě z prachu', a: 'Adorare' },
	{ t: 'Nebeský Otče', a: 'Nomads' },
	{ t: 'Ať požehnán je Bůh', a: 'ESPÉ' },
	{ t: 'Svatý, svatý, svatý', a: 'Worship' },
	{ t: 'Vylej svého Ducha', a: 'Nová píseň' },
	{ t: 'Chválím Tě', a: 'Timothy' },
	{ t: 'Tvá láska', a: 'Adorare' },
	{ t: 'Jenom Ty', a: 'Nomads' },
	{ t: 'Sláva na výsostech', a: 'ESPÉ' },
	{ t: 'Přijď, Duchu svatý', a: 'Svítání' },
	{ t: 'Můj Pán', a: 'Chvály' },
]

const GROUP_CARD_SX = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	overflow: 'hidden',
} as const

function LeadingIcon() {
	return (
		<Box
			sx={{
				width: 40,
				height: 40,
				borderRadius: 2,
				bgcolor: 'grey.100',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
			}}
		>
			<MusicNoteRounded sx={{ fontSize: 20, color: 'grey.600' }} />
		</Box>
	)
}

/** TEMPORARY demo page to preview the MobileAppHeader shell. Delete before finalizing. */
function DemoHeader() {
	return (
		<MobileAppHeader
			title="Moje písně"
			subtitle="8 písní"
			backTo="account"
			action={
				<IconButton color="grey.700" alt="Hledat">
					<SearchRounded />
				</IconButton>
			}
		>
			<Box sx={GROUP_CARD_SX}>
				{SONGS.map((s, i) => (
					<Fragment key={i}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1.5,
								paddingX: 1.75,
								paddingY: 1.25,
							}}
						>
							<LeadingIcon />
							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Typography
									strong={600}
									sx={{
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									}}
								>
									{s.t}
								</Typography>
								<Typography
									small
									color="grey.600"
									sx={{
										whiteSpace: 'nowrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									}}
								>
									{s.a}
								</Typography>
							</Box>
							<ChevronRightRounded sx={{ color: 'grey.400', flexShrink: 0 }} />
						</Box>
						{i < SONGS.length - 1 && (
							<Box
								sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: 8.5 }}
							/>
						)}
					</Fragment>
				))}
			</Box>
		</MobileAppHeader>
	)
}
