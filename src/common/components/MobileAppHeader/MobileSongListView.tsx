'use client'

import { BasicVariantPack } from '@/api/dtos'
import { MobileAppHeader } from '@/common/components/MobileAppHeader'
import { Box, Typography } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { RoutesKeys, SmartAllParams } from '@/routes/routes.types'
import { ChevronRightRounded, MusicNoteRounded } from '@mui/icons-material'
import { ReactNode, Fragment } from 'react'

// one white "group" surface holding the song rows (iOS-style grouped list),
// matching the songs list / home screens
const GROUP_CARD_SX = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	overflow: 'hidden',
} as const

// strip the card chrome off SongVariantCard so it reads as a row in the group
const FLAT_ROW_SX = {
	bgcolor: 'transparent',
	borderRadius: 0,
	outlineColor: 'transparent',
	'&:hover': { bgcolor: 'grey.50', boxShadow: 'none' },
	'&:active': { bgcolor: 'grey.100' },
} as const

// divider starts past the leading icon: row padding + icon + gap
const DIVIDER_INSET = 8.5
const PREVIEW_LINES = 1
const SKELETON_ROWS = 8

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

function Divider() {
	return (
		<Box sx={{ height: '1px', bgcolor: 'grey.200', marginLeft: DIVIDER_INSET }} />
	)
}

type MobileSongListViewProps<T extends RoutesKeys> = {
	title: string
	subtitle?: string
	backTo?: T
	backParams?: SmartAllParams<T>
	action?: ReactNode
	items: BasicVariantPack[]
	loading?: boolean
	emptyText?: string
}

/**
 * Shared mobile screen for a list of songs: the collapsing MobileAppHeader plus
 * an S5 grouped list of tappable song rows (leading note icon + disclosure
 * chevron). Used by the account song-list pages (Moje písně, Oblíbené) so they
 * share one native-feeling layout.
 */
export default function MobileSongListView<T extends RoutesKeys>({
	title,
	subtitle,
	backTo,
	backParams,
	action,
	items,
	loading,
	emptyText,
}: MobileSongListViewProps<T>) {
	return (
		<MobileAppHeader
			title={title}
			subtitle={subtitle}
			backTo={backTo}
			backParams={backParams}
			action={action}
		>
			{loading ? (
				<Box sx={GROUP_CARD_SX}>
					{Array.from({ length: SKELETON_ROWS }).map((_, i) => (
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
								<Skeleton
									variant="rounded"
									sx={{
										width: 40,
										height: 40,
										borderRadius: 2,
										bgcolor: 'grey.100',
										flexShrink: 0,
									}}
								/>
								<Box sx={{ flex: 1 }}>
									<Skeleton
										variant="text"
										sx={{ width: '55%', bgcolor: 'grey.100' }}
									/>
									<Skeleton
										variant="text"
										sx={{ width: '80%', bgcolor: 'grey.100' }}
									/>
								</Box>
							</Box>
							{i < SKELETON_ROWS - 1 && <Divider />}
						</Fragment>
					))}
				</Box>
			) : items.length === 0 ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						textAlign: 'center',
						gap: 1,
						paddingTop: 8,
						paddingX: 3,
					}}
				>
					<MusicNoteRounded sx={{ fontSize: 48, color: 'grey.400' }} />
					{emptyText && <Typography color="grey.600">{emptyText}</Typography>}
				</Box>
			) : (
				<Box sx={GROUP_CARD_SX}>
					{items.map((v, i) => (
						<Fragment key={`${String(v.packGuid)}-${i}`}>
							<SongVariantCard
								data={v}
								dense
								previewLines={PREVIEW_LINES}
								leadingIcon={<LeadingIcon />}
								trailingIcon={
									<ChevronRightRounded sx={{ color: 'grey.400' }} />
								}
								sx={FLAT_ROW_SX}
							/>
							{i < items.length - 1 && <Divider />}
						</Fragment>
					))}
				</Box>
			)}
		</MobileAppHeader>
	)
}
