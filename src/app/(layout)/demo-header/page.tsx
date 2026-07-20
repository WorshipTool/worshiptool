'use client'

import {
	MobileAppHeader,
	MobileFab,
} from '@/common/components/MobileAppHeader'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, IconButton, Typography } from '@/common/ui'
import { Pagination } from '@/common/ui/mui'
import {
	AddRounded,
	ChevronRightRounded,
	MoreVertRounded,
	MusicNoteRounded,
	SearchRounded,
} from '@mui/icons-material'
import { Fragment, useState } from 'react'

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

/** Demo segmented control for the header's controlPanel slot. */
function SortSegment() {
	const options = ['Naposledy', 'Podle názvu', 'Veřejné']
	const [active, setActive] = useState(0)
	return (
		<Box
			sx={{
				display: 'flex',
				gap: 0.5,
				bgcolor: 'grey.200',
				borderRadius: 2.5,
				padding: 0.5,
			}}
		>
			{options.map((o, i) => (
				<Box
					key={o}
					onClick={() => setActive(i)}
					sx={{
						flex: 1,
						textAlign: 'center',
						paddingY: 0.75,
						borderRadius: 2,
						cursor: 'pointer',
						bgcolor: active === i ? 'background.paper' : 'transparent',
						boxShadow: active === i ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
					}}
				>
					<Typography
						small
						strong={600}
						color={active === i ? 'grey.900' : 'grey.600'}
					>
						{o}
					</Typography>
				</Box>
			))}
		</Box>
	)
}

/** TEMPORARY demo page to preview the MobileAppHeader template. Delete before finalizing. */
function DemoHeader() {
	const [page, setPage] = useState(1)
	return (
		<MobileAppHeader
			title="Moje písně"
			subtitle="48 písní"
			backTo="account"
			actions={[
				<IconButton key="search" color="grey.800" alt="Hledat">
					<SearchRounded />
				</IconButton>,
				<IconButton key="more" color="grey.800" alt="Více">
					<MoreVertRounded />
				</IconButton>,
			]}
			controlPanel={<SortSegment />}
			fab={
				<MobileFab to="addMenu" alt="Přidat">
					<AddRounded />
				</MobileFab>
			}
			bottomPanel={
				<Pagination
					count={8}
					page={page}
					onChange={(_, p) => setPage(p)}
					color="primary"
					siblingCount={0}
					boundaryCount={1}
					sx={{
						'& .MuiPaginationItem-root': {
							minWidth: 44,
							height: 44,
							margin: '0 2px',
							fontSize: '1rem',
						},
					}}
				/>
			}
			scrollResetKey={page}
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
							<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: 8.5 }} />
						)}
					</Fragment>
				))}
			</Box>
		</MobileAppHeader>
	)
}
